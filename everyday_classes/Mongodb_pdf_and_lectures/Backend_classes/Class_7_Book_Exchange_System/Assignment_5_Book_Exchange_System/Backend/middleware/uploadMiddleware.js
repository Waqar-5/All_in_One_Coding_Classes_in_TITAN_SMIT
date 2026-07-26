// ======================================================
// Upload Middleware (Multer)
// Handles book cover images, profile photos, and book PDFs — disk
// storage under /uploads, with per-field type + size validation.
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
// File Filter — Allowed Types Per Field
// "image" / "profileImage" → images only
// "pdfFile" → PDF only
// ===========================

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_PDF_TYPES = ["application/pdf"];

const fileFilter = (req, file, cb) => {

    if (file.fieldname === "pdfFile") {

        if (ALLOWED_PDF_TYPES.includes(file.mimetype)) {
            return cb(null, true);
        }

        return cb(new multer.MulterError(
            "LIMIT_UNEXPECTED_FILE",
            "Only PDF files are allowed for the book PDF."
        ));

    }

    // "image" and "profileImage" fields
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        return cb(null, true);
    }

    cb(new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only JPG, JPEG, PNG, and WEBP images are allowed."
    ));

};

// ===========================
// Multer Instance
// Max size: 15 MB (accommodates a modest PDF; images are additionally
// capped at 5 MB client-side in the ImageUpload component)
// ===========================

const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 15 * 1024 * 1024 // 15 MB
    }

});

module.exports = upload;
