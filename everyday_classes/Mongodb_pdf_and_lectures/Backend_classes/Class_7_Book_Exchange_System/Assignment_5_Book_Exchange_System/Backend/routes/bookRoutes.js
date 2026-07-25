// ======================================================
// Book Routes
// ======================================================

const express = require("express");

const router = express.Router();

// ======================================================
// Import Controllers
// ======================================================

const {
    addBook,
    getAllBooks,
    getBookById,
    getMyBooks,
    getStats,
    getAllBooksAdmin,
    updateBook,
    deleteBook,
    restoreBook,
    permanentDeleteBook
} = require("../controllers/bookController");

// ======================================================
// Import Authentication Middleware
// ======================================================

const {

    protect,

    adminOnly

} = require("../middleware/authMiddleware");

// ======================================================
// Import Upload Middleware
// ======================================================

const upload = require("../middleware/uploadMiddleware");

// ======================================================
// Public Routes
// ======================================================

// Get All Books
// GET /api/books

router.get("/", getAllBooks);

// ======================================================
// Private / Fixed-Path Routes
// NOTE: "/my-books" and "/stats" must be registered BEFORE
// the "/:id" route below, or Express will match them as
// an :id param and the request will never reach the
// intended handler.
// ======================================================

// Get Logged-in User Books
// GET /api/books/my-books

router.get("/my-books", protect, getMyBooks);

// Get Catalog Stats (for the Dashboard)
// GET /api/books/stats

router.get("/stats", getStats);

// Get All Books, Including Soft-Deleted (Admin)
// GET /api/books/admin/all

router.get("/admin/all", protect, adminOnly, getAllBooksAdmin);

// Add Book (multipart/form-data — cover image required)
// POST /api/books

router.post("/", protect, upload.single("image"), addBook);

// ======================================================
// Public Route (must come after /my-books and /stats)
// ======================================================

// Get Single Book
// GET /api/books/:id

router.get("/:id", getBookById);

// Update Book (multipart/form-data — cover image optional)
// PUT /api/books/:id

router.put("/:id", protect, upload.single("image"), updateBook);

// Delete Book (Soft Delete)
// DELETE /api/books/:id

router.delete("/:id", protect, deleteBook);

// ======================================================
// Admin Routes
// ======================================================

// Restore Deleted Book
// PATCH /api/books/restore/:id

router.patch(

    "/restore/:id",

    protect,

    adminOnly,

    restoreBook

);

// Permanent Delete Book
// DELETE /api/books/permanent/:id

router.delete(

    "/permanent/:id",

    protect,

    adminOnly,

    permanentDeleteBook

);

// ======================================================
// Export Router
// ======================================================

module.exports = router;
