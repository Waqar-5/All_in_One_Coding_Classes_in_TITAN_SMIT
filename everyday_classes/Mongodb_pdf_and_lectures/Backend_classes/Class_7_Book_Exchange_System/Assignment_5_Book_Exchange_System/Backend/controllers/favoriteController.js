// ======================================================
// Favorites (Wishlist) Controller
// ======================================================

const mongoose = require("mongoose");
const User = require("../models/User");
const Book = require("../models/book");

// ======================================================
// Toggle Favorite
// POST /api/favorites/:bookId
// Private Route — adds the book if not favorited, removes it if it is
// ======================================================

const toggleFavorite = async (req, res) => {

    try {

        const { bookId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ success: false, message: "Invalid book id." });
        }

        const book = await Book.findOne({ _id: bookId, isDeleted: false });

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found." });
        }

        const user = await User.findById(req.user._id);

        const alreadyFavorited = user.favorites.some(
            (id) => id.toString() === bookId
        );

        if (alreadyFavorited) {

            user.favorites = user.favorites.filter((id) => id.toString() !== bookId);

        } else {

            user.favorites.push(bookId);

        }

        await user.save();

        res.status(200).json({

            success: true,

            isFavorite: !alreadyFavorited,

            message: alreadyFavorited ? "Removed from wishlist." : "Added to wishlist."

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
// Get My Favorites (Wishlist)
// GET /api/favorites
// Private Route
// ======================================================

const getMyFavorites = async (req, res) => {

    try {

        const user = await User.findById(req.user._id).populate({

            path: "favorites",

            match: { isDeleted: false },

            populate: {
                path: "owner",
                select: "name city"
            }

        });

        // Populate with a `match` filters out soft-deleted books but leaves
        // a null in their place in the array — drop those.
        const books = user.favorites.filter(Boolean);

        res.status(200).json({

            success: true,

            totalBooks: books.length,

            books

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
// Get My Favorite Book IDs Only
// GET /api/favorites/ids
// Private Route — lightweight, used by the frontend to know which
// books to render as "favorited" without fetching full book data
// ======================================================

const getMyFavoriteIds = async (req, res) => {

    try {

        const user = await User.findById(req.user._id).select("favorites");

        res.status(200).json({

            success: true,

            favoriteIds: user.favorites.map((id) => id.toString())

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

module.exports = {
    toggleFavorite,
    getMyFavorites,
    getMyFavoriteIds
};
