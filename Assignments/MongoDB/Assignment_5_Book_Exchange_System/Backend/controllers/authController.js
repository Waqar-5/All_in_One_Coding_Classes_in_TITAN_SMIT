// ======================================================
// Authentication Controller
// ======================================================

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

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
// Export Controller
// ======================================================

module.exports = {

    registerUser,
    loginUser

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