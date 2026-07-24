// ======================================================
// Authentication Middleware
// ======================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ======================================================
// Protect Routes Middleware
// ======================================================

const protect = async (req, res, next) => {

    try {

        // ===========================
        // Get Token From Header
        // ===========================

        let token;

        if (

            req.headers.authorization &&

            req.headers.authorization.startsWith("Bearer")

        ) {

            token = req.headers.authorization.split(" ")[1];

        }

        // ===========================
        // Check Token
        // ===========================

        if (!token) {

            return res.status(401).json({

                success: false,
                message: "Access denied. No token provided."

            });

        }

        // ===========================
        // Verify JWT Token
        // ===========================

        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );

        // ===========================
        // Find Logged-in User
        // ===========================

        const user = await User.findById(decoded.id);

        if (!user) {

            return res.status(401).json({

                success: false,
                message: "User not found."

            });

        }

        // ===========================
        // Save User In Request
        // ===========================

        req.user = user;

        // ===========================
        // Go To Next Middleware
        // ===========================

        next();

    }

    catch (error) {

        return res.status(401).json({

            success: false,
            message: "Invalid or Expired Token."

        });

    }

};

// ======================================================
// Admin Middleware
// ======================================================

const adminOnly = (req, res, next) => {

    if (req.user.role !== "Admin") {

        return res.status(403).json({

            success: false,
            message: "Admin access only."

        });

    }

    next();

};

// ======================================================
// Export
// ======================================================

module.exports = {

    protect,

    adminOnly

};