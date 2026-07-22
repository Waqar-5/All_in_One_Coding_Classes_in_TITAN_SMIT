// ======================================================
// Upload Middleware (Multer)
// Handles book cover image uploads — disk storage under
// /uploads, with type + size validation.
// ======================================================

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// Make sure the uploads folder exists (fresh clones won't have it,
// since it's usually empty and not committed to git).
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ===========================
// Storage Engine
// ===========================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },

    filename: (req, file, cb) => {

        // e.g. 1723456789123-atomic-habits.jpg
        const safeName = file.originalname
            .toLowerCase()
            .replace(/[^a-z0-9.\-]/g, "-");

        cb(null, `${Date.now()}-${safeName}`);

    }

});

// ===========================
// File Filter — Allowed Types
// ===========================

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {

    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new multer.MulterError(
            "LIMIT_UNEXPECTED_FILE",
            "Only JPG, JPEG, PNG, and WEBP images are allowed."
        ));
    }

};

// ===========================
// Multer Instance
// Max size: 5 MB
// ===========================

const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }

});

module.exports = upload;
