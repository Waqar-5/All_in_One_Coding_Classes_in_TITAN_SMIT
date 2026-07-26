// ======================================================
// User Model
// ======================================================

const mongoose = require("mongoose");

// ======================================================
// User Schema
// ======================================================

const userSchema = new mongoose.Schema({

    // ===========================
    // Full Name
    // ===========================

    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: 2,
        maxlength: 50
    },

    // ===========================
    // Email
    // ===========================

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },

    // ===========================
    // Password
    // Store only hashed password
    // ===========================

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
        select: false
    },

    // ===========================
    // Profile Image
    // ===========================

    profileImage: {
        type: String,
        default: ""
    },

    // ===========================
    // Phone Number
    // ===========================

    phone: {
        type: String,
        trim: true,
        default: ""
    },

    // ===========================
    // City
    // ===========================

    city: {
        type: String,
        trim: true,
        default: ""
    },

    // ===========================
    // Bio
    // ===========================

    bio: {
        type: String,
        trim: true,
        maxlength: 300,
        default: ""
    },

    // ===========================
    // User Role
    // ===========================

    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User"
    },

    // ===========================
    // Email Verification
    // ===========================

    isVerified: {
        type: Boolean,
        default: false
    },

    // ===========================
    // Favorite Books
    // References Book collection
    // ===========================

    favorites: [

        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        }

    ],

    // ===========================
    // Soft Delete
    // ===========================

    isDeleted: {
        type: Boolean,
        default: false
    },

    // ===========================
    // Blocked By Admin
    // Distinct from isDeleted: this actively prevents login and revokes
    // access on every request, not just a soft-delete flag.
    // ===========================

    isBlocked: {
        type: Boolean,
        default: false
    },

    // ===========================
    // Book Listing Limit (set by Admin)
    // null = no limit
    // ===========================

    bookLimit: {
        type: Number,
        default: null
    },

    // ===========================
    // Password Reset
    // Only the SHA-256 hash of the reset token is stored — the raw
    // token is what's emailed to the user and never touches the DB,
    // so a database leak alone can't be used to reset anyone's password.
    // ===========================

    resetPasswordToken: {
        type: String,
        default: undefined
    },

    resetPasswordExpire: {
        type: Date,
        default: undefined
    }

},
{
    timestamps: true
});

// ======================================================
// Export Model
// ======================================================

module.exports = mongoose.model("User", userSchema);