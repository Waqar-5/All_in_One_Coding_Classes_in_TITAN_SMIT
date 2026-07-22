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
// Public Routes
// ======================================================

// Get All Books
// GET /api/books

router.get("/", getAllBooks);

// Get Single Book
// GET /api/books/:id

router.get("/:id", getBookById);

// ======================================================
// Private Routes
// ======================================================

// Get Logged-in User Books
// GET /api/books/my-books

router.get("/my-books", protect, getMyBooks);

// Add Book
// POST /api/books

router.post("/", protect, addBook);

// Update Book
// PUT /api/books/:id

router.put("/:id", protect, updateBook);

// Delete Book (Soft Delete)
// DELETE /api/books/:id

router.delete("/:id", protect, deleteBook);


router.delete(
    "/permanent-delete/:id",
    permanentDeleteBook
);
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