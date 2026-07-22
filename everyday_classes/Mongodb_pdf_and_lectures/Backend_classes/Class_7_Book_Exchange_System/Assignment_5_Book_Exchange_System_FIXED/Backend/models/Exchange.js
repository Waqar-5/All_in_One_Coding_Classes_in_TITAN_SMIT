// ======================================================
// Exchange Request Model
// Tracks a user's request to swap for another user's book
// ======================================================

const mongoose = require("mongoose");

const exchangeSchema = new mongoose.Schema({

    // ===========================
    // Book Being Requested
    // ===========================

    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },

    // ===========================
    // User Requesting The Book
    // ===========================

    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // ===========================
    // User Who Owns The Book
    // ===========================

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // ===========================
    // Optional Message From Requester
    // ===========================

    message: {
        type: String,
        trim: true,
        maxlength: 300,
        default: ""
    },

    // ===========================
    // Request Status
    // ===========================

    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected", "Cancelled"],
        default: "Pending"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Exchange", exchangeSchema);
