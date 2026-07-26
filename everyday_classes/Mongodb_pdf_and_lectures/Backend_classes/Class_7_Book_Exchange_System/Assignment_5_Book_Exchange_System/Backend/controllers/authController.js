// ======================================================
// Authentication Controller
// ======================================================

const User = require("../models/User");
const Book = require("../models/book");
const Exchange = require("../models/Exchange");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const validator = require("validator");
const { deleteUploadedFile } = require("../utils/fileHelpers");
const sendEmail = require("../utils/sendEmail");

// ======================================================
// Register User
// POST /api/auth/register
// ======================================================

const registerUser = async (req, res) => {

    try {

        // ===========================
        // Get Request Body
        // ===========================

        const { name, email, password } = req.body;

        // ===========================
        // Empty Validation
        // ===========================

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });

        }

        // ===========================
        // Email Validation
        // ===========================

        if (!validator.isEmail(email)) {

            return res.status(400).json({
                success: false,
                message: "Invalid email address."
            });

        }

        // ===========================
        // Password Validation
        // ===========================

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters."
            });

        }

        // ===========================
        // Check Existing User
        // ===========================

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });

        }

        // ===========================
        // Hash Password
        // ===========================

        const hashedPassword = await bcrypt.hash(password, 10);

        // ===========================
        // Create User
        // ===========================

        const user = await User.create({

            name,
            email,
            password: hashedPassword

        });

        // ===========================
        // Generate JWT
        // ===========================

        const token = jwt.sign(

            {
                id: user._id,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: process.env.JWT_EXPIRE
            }

        );

        // ===========================
        // Hide Password
        // (select:false only applies to future queries, not to the
        // document just returned by User.create() — strip it manually)
        // ===========================

        user.password = undefined;

        // ===========================
        // Success Response
        // ===========================

        res.status(201).json({

            success: true,
            message: "User Registered Successfully.",
            token,
            user

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================================
// Login User
// POST /api/auth/login
// ======================================================

const loginUser = async (req, res) => {

    try {

        // ===========================
        // Get Request Body
        // ===========================

        const { email, password } = req.body;

        // ===========================
        // Validation
        // ===========================

        if (!email || !password) {

            return res.status(400).json({

                success: false,
                message: "Email and Password are required."

            });

        }

        // ===========================
        // Find User
        // Include Password
        // ===========================

        const user = await User.findOne({ email }).select("+password");

        if (!user) {

            return res.status(401).json({

                success: false,
                message: "Invalid Email or Password."

            });

        }

        // ===========================
        // Compare Password
        // ===========================

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(401).json({

                success: false,
                message: "Invalid Email or Password."

            });

        }

        // ===========================
        // Blocked Check
        // ===========================

        if (user.isBlocked) {

            return res.status(401).json({

                success: false,
                message: "Your account has been blocked by an admin. Contact support if you think this is a mistake."

            });

        }

        // ===========================
        // Bootstrap Admin Self-Heal
        // If this is the designated admin email (see .env / config/
        // seedAdmin.js), make sure it's flagged Admin right before we
        // issue the token — covers the edge case where .env was added
        // or edited without restarting the server since.
        // ===========================

        if (
            process.env.ADMIN_EMAIL &&
            user.email === process.env.ADMIN_EMAIL.toLowerCase() &&
            user.role !== "Admin"
        ) {
            user.role = "Admin";
            await user.save();
        }

        // ===========================
        // Generate JWT
        // ===========================

        const token = jwt.sign(

            {
                id: user._id,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: process.env.JWT_EXPIRE
            }

        );

        // ===========================
        // Hide Password
        // ===========================

        user.password = undefined;

        // ===========================
        // Success Response
        // ===========================

        res.status(200).json({

            success: true,
            message: "Login Successful.",
            token,
            user

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================================
// Get My Profile (with stats)
// GET /api/auth/me
// Private Route
// ======================================================

const getMe = async (req, res) => {

    try {

        const userId = req.user._id;

        const [booksListed, booksExchanged, exchangesCompleted] = await Promise.all([

            Book.countDocuments({ owner: userId, isDeleted: false }),

            Book.countDocuments({ owner: userId, status: "Exchanged", isDeleted: false }),

            Exchange.countDocuments({
                status: "Accepted",
                $or: [{ owner: userId }, { requester: userId }]
            })

        ]);

        res.status(200).json({

            success: true,

            user: req.user,

            stats: {
                booksListed,
                booksExchanged,
                exchangesCompleted
            }

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================================
// Update My Profile
// PUT /api/auth/profile
// Private Route (multipart/form-data — profileImage optional)
// ======================================================

const updateProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // ===========================
        // Text Fields
        // ===========================

        const updatableFields = ["name", "phone", "city", "bio"];

        updatableFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        // ===========================
        // Profile Image — Replace / Remove / Keep
        // ===========================

        if (req.file) {

            deleteUploadedFile(user.profileImage);
            user.profileImage = `uploads/${req.file.filename}`;

        } else if (req.body.removeImage === "true") {

            deleteUploadedFile(user.profileImage);
            user.profileImage = "";

        }

        const updatedUser = await user.save();

        res.status(200).json({

            success: true,
            message: "Profile updated successfully.",
            user: updatedUser

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================================
// Change Password
// PUT /api/auth/change-password
// Private Route
// ======================================================

const changePassword = async (req, res) => {

    try {

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {

            return res.status(400).json({
                success: false,
                message: "Current and new password are both required."
            });

        }

        if (newPassword.length < 6) {

            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters."
            });

        }

        // Password has select:false — fetch it explicitly this time
        const user = await User.findById(req.user._id).select("+password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {

            // 403, not 401: the user IS authenticated (their JWT is fine) —
            // they just got the current password wrong. Using 401 here
            // would trigger the frontend's "session expired, clear the
            // token" logic on a simple wrong-password guess, logging them
            // out of a perfectly valid session.
            return res.status(403).json({
                success: false,
                message: "Current password is incorrect."
            });

        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({

            success: true,
            message: "Password changed successfully."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================================
// Forgot Password
// POST /api/auth/forgot-password
// Public Route — always returns a generic success message, whether or
// not the email exists, so this can't be used to enumerate accounts.
// ======================================================

const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required." });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        const genericResponse = {
            success: true,
            message: "If an account exists for that email, a password reset link has been sent."
        };

        if (!user) {
            // Don't reveal whether the email is registered.
            return res.status(200).json(genericResponse);
        }

        // Generate a random token — only its SHA-256 hash is stored in
        // the DB. The raw token goes in the email link and is never
        // saved anywhere, so a database leak alone can't be used to
        // reset anyone's password.
        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${rawToken}`;

        try {

            await sendEmail({
                to: user.email,
                subject: "Reset your Chapter & Verse password",
                html: `
                    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                        <h2>Reset your password</h2>
                        <p>Hi ${user.name},</p>
                        <p>Someone requested a password reset for your Chapter &amp; Verse account. If this wasn't you, you can safely ignore this email.</p>
                        <p style="margin: 24px 0;">
                            <a href="${resetUrl}" style="background:#3F6B4F;color:#fff;padding:12px 24px;border-radius:9999px;text-decoration:none;">
                                Reset Password
                            </a>
                        </p>
                        <p>Or copy this link into your browser:<br>${resetUrl}</p>
                        <p>This link expires in 15 minutes.</p>
                    </div>
                `
            });

        } catch (emailError) {

            // Sending failed — don't leave a valid dangling token behind.
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            console.error("Failed to send reset email:", emailError.message);

            return res.status(500).json({
                success: false,
                message: "Couldn't send the reset email. Please try again later, or contact support."
            });

        }

        res.status(200).json(genericResponse);

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================================
// Reset Password
// POST /api/auth/reset-password/:token
// Public Route
// ======================================================

const resetPassword = async (req, res) => {

    try {

        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
        }

        const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {

            return res.status(400).json({

                success: false,
                message: "This reset link is invalid or has expired. Please request a new one."

            });

        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({

            success: true,
            message: "Password reset successfully. You can now log in."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================================
// Get All Users (Admin)
// GET /api/auth/users
// Admin Route
// ======================================================

// ======================================================
// Get A Specific User's Profile + Their Books (Admin)
// GET /api/auth/users/:id
// Admin Route
// ======================================================

const getUserDetailsAdmin = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Every book this user has ever listed, including soft-deleted
        // ones (an admin should be able to see the full picture) — most
        // recent first.
        const books = await Book.find({ owner: user._id }).sort({ createdAt: -1 });

        const stats = {
            totalBooks: books.length,
            activeBooks: books.filter((b) => !b.isDeleted).length,
            exchangedBooks: books.filter((b) => b.status === "Exchanged").length
        };

        res.status(200).json({

            success: true,
            user,
            books,
            stats

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

const getAllUsers = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const { search } = req.query;

        const query = {};

        if (search) {
            const regex = { $regex: search, $options: "i" };
            query.$or = [{ name: regex }, { email: regex }];
        }

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments(query);

        res.status(200).json({

            success: true,
            totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            users

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================================
// Update A User's Role (Admin)
// PATCH /api/auth/users/:id/role
// Admin Route
// ======================================================

const updateUserRole = async (req, res) => {

    try {

        const { role } = req.body;

        if (!["User", "Admin"].includes(role)) {
            return res.status(400).json({ success: false, message: "Role must be 'User' or 'Admin'." });
        }

        if (req.params.id === req.user._id.toString() && role === "User") {
            return res.status(400).json({ success: false, message: "You can't demote your own account." });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({

            success: true,
            message: `${user.name} is now ${role === "Admin" ? "an Admin" : "a User"}.`,
            user

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================================
// Toggle A User's Deleted Status (Admin)
// PATCH /api/auth/users/:id/toggle-delete
// Admin Route — soft delete / restore, mirrors book soft-delete
// ======================================================

const toggleUserBlocked = async (req, res) => {

    try {

        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: "You can't block your own account." });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // The bootstrap admin (set via ADMIN_EMAIL) should never be
        // lockable out by another admin — it's the account of last resort.
        if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL.toLowerCase()) {
            return res.status(400).json({ success: false, message: "The bootstrap admin account can't be blocked." });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.status(200).json({

            success: true,
            message: user.isBlocked ? "User blocked. They'll be logged out and can't log back in until unblocked." : "User unblocked.",
            user

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================================
// Set A User's Book Listing Limit (Admin)
// PATCH /api/auth/users/:id/book-limit
// Admin Route — bookLimit: number to cap listings, or null for no limit
// ======================================================

const updateUserBookLimit = async (req, res) => {

    try {

        const { bookLimit } = req.body;

        if (bookLimit !== null && (typeof bookLimit !== "number" || bookLimit < 0)) {
            return res.status(400).json({ success: false, message: "Book limit must be a non-negative number, or null for no limit." });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { bookLimit },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({

            success: true,
            message: bookLimit === null ? `${user.name}'s book limit removed.` : `${user.name} can now list up to ${bookLimit} book(s).`,
            user

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================================
// Export Controller
// ======================================================

module.exports = {

    registerUser,
    loginUser,
    getMe,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    getAllUsers,
    getUserDetailsAdmin,
    updateUserRole,
    toggleUserBlocked,
    updateUserBookLimit

};

// const User = require("../models/User");
// const bcrypt = require("bcryptjs");

// // ============================
// // Register User
// // POST /api/auth/register
// // ============================

// const registerUser = async (req, res) => {

//     try {

//         // Get user data from request body
//         const { name, email, password } = req.body;

//         // Check if all required fields are provided
//         if (!name || !email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please fill all fields."
//             });
//         }

//         // Check if email already exists
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Email already registered."
//             });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create new user
//         const user = await User.create({
//             name,
//             email,
//             password: hashedPassword
//         });

//         // Success response
//         res.status(201).json({
//             success: true,
//             message: "User registered successfully.",
//             user
//         });

//     } catch (error) {

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });

//     }

// };

// module.exports = {
//     registerUser
// };