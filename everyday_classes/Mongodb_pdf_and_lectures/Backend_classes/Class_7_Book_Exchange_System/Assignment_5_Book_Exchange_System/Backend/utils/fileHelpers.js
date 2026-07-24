// ======================================================
// File Helpers
// Shared across bookController and authController so
// image-deletion logic isn't duplicated between them.
// ======================================================

const fs = require("fs");
const path = require("path");

// Deletes a previously uploaded file (book cover or profile image) from
// disk. Safe to call even if the file is missing or the record had none.
// `relativePath` is expected to look like "uploads/xyz.jpg".
const deleteUploadedFile = (relativePath) => {

    if (!relativePath) return;

    const filePath = path.join(__dirname, "..", relativePath);

    fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
            console.error("Couldn't delete file:", err.message);
        }
    });

};

module.exports = { deleteUploadedFile };
