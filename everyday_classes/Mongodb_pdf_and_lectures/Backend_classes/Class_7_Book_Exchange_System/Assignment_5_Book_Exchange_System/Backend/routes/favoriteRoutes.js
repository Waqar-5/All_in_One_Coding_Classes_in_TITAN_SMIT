// ======================================================
// Favorites (Wishlist) Routes
// ======================================================

const express = require("express");
const router = express.Router();

const {
    toggleFavorite,
    getMyFavorites,
    getMyFavoriteIds
} = require("../controllers/favoriteController");

const { protect } = require("../middleware/authMiddleware");

// All favorites routes require a logged-in user.

// Lightweight — just the IDs, used to mark hearts as filled across the app
// GET /api/favorites/ids
router.get("/ids", protect, getMyFavoriteIds);

// Full wishlist page data
// GET /api/favorites
router.get("/", protect, getMyFavorites);

// Add / remove a book from the wishlist
// POST /api/favorites/:bookId
router.post("/:bookId", protect, toggleFavorite);

module.exports = router;
