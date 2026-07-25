// ======================================================
// Authentication Controller
// ======================================================

const User = require("../models/User");
const Book = require("../models/book");
const Exchange = require("../models/Exchange");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { deleteUploadedFile } = require("../utils/fileHelpers");

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
// Export Controller
// ======================================================

// ======================================================
// Get All Users (Admin)
// GET /api/auth/users
// Admin Route
// ======================================================

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

const toggleUserDeleted = async (req, res) => {

    try {

        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: "You can't delete your own account." });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        user.isDeleted = !user.isDeleted;
        await user.save();

        res.status(200).json({

            success: true,
            message: user.isDeleted ? "User deactivated." : "User restored.",
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
    getAllUsers,
    updateUserRole,
    toggleUserDeleted

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