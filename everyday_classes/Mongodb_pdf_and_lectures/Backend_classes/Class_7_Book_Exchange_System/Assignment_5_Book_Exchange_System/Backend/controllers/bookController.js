// ======================================================
// Book Controller
// ======================================================

const mongoose = require("mongoose");
const Book = require("../models/book");
const { deleteUploadedFile: deleteImageFile } = require("../utils/fileHelpers");

// FormData can't send real arrays — "tags" arrives either as a
// JSON string (["a","b"]) or a plain comma-separated string.
const parseTags = (tags) => {

    if (!tags) return [];
    if (Array.isArray(tags)) return tags;

    try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) return parsed;
    } catch {
        // not JSON — fall through to comma-split
    }

    return tags.split(",").map((t) => t.trim()).filter(Boolean);

};

// ======================================================
// Add New Book
// POST /api/books
// Private Route
// ======================================================

const addBook = async (req, res) => {

    try {

        // ===========================
        // Get Data From Request Body
        // ===========================

        const {

            title,
            author,
            category,
            description,
            condition,
            language,
            publisher,
            publishedYear,
            isbn,
            location,
            tags,
            status

        } = req.body;

        // ===========================
        // Required Validation
        // ===========================

        if (

            !title ||

            !author ||

            !category

        ) {

            // Multer already wrote the file to disk before this check ran —
            // don't leave an orphaned upload behind.
            if (req.file) deleteImageFile(`uploads/${req.file.filename}`);

            return res.status(400).json({

                success: false,

                message: "Title, Author and Category are required."

            });

        }

        // ===========================
        // Book Cover Image Is Required
        // ===========================

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Book image is required."

            });

        }

        // ===========================
        // Create Book
        // ===========================

        const book = await Book.create({

            title,

            author,

            category,

            description,

            condition,

            language,

            publisher,

            publishedYear: publishedYear || undefined,

            isbn: isbn || undefined,

            location,

            tags: parseTags(tags),

            status: status || undefined,

            coverImage: `uploads/${req.file.filename}`,

            owner: req.user._id

        });

        // ===========================
        // Success Response
        // ===========================

        res.status(201).json({

            success: true,

            message: "Book Added Successfully.",

            book

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
// Get All Books
// GET /api/books
// Public Route
// ======================================================

const getAllBooks = async (req, res) => {

    try {

        // ===========================
        // Query Parameters
        // ===========================

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        // ===========================
        // Find Books
        // ===========================

        const books = await Book.find({

            isDeleted: false,

            status: "Available"

        })

        .populate(

            "owner",

            "name email city profileImage"

        )

        .sort({

            createdAt: -1

        })

        .skip(skip)

        .limit(limit);

        // ===========================
        // Total Books
        // ===========================

        const totalBooks = await Book.countDocuments({

            isDeleted: false,

            status: "Available"

        });

        // ===========================
        // Success Response
        // ===========================

        res.status(200).json({

            success: true,

            totalBooks,

            currentPage: page,

            totalPages: Math.ceil(totalBooks / limit),

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
// Get Single Book
// GET /api/books/:id
// Public Route
// ======================================================

let getBookById = async (req, res) => {

    try {

        // ===========================
        // Validate ID Format
        // ===========================

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid book id."
            });

        }

        // ===========================
        // Find Book By ID
        // ===========================

        const book = await Book.findOne({

            _id: req.params.id,

            isDeleted: false

        }).populate(

            "owner",

            "name email city profileImage"

        );

        // ===========================
        // Check Book Exists
        // ===========================

        if (!book) {

            return res.status(404).json({

                success: false,

                message: "Book not found."

            });

        }

        // ===========================
        // Increase View Count
        // ===========================

        book.views += 1;

        await book.save();

        // ===========================
        // Success Response
        // ===========================

        res.status(200).json({

            success: true,

            book

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
// Get Logged-in User Books
// GET /api/books/my-books
// Private Route
// ======================================================

const getMyBooks = async (req, res) => {

    try {

        // ===========================
        // Find My Books
        // ===========================

        const books = await Book.find({

            owner: req.user._id,

            isDeleted: false

        })

        .sort({

            createdAt: -1

        });

        // ===========================
        // Success Response
        // ===========================

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
// Get Catalog Stats
// GET /api/books/stats
// Public Route — powers the Dashboard
// ======================================================

const getStats = async (req, res) => {

    try {

        const baseQuery = { isDeleted: false };

        const [totalBooks, statusCounts, categoryCounts] = await Promise.all([

            Book.countDocuments(baseQuery),

            Book.aggregate([
                { $match: baseQuery },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),

            Book.aggregate([
                { $match: baseQuery },
                { $group: { _id: "$category", count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ])

        ]);

        const byStatus = { Available: 0, Requested: 0, Reserved: 0, Exchanged: 0 };
        statusCounts.forEach((s) => {
            if (s._id) byStatus[s._id] = s.count;
        });

        const byCategory = categoryCounts.map((c) => ({ category: c._id, count: c.count }));

        res.status(200).json({

            success: true,

            totalBooks,

            byStatus,

            byCategory

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
// Get Single Book
// GET /api/books/:id
// Public Route
// ======================================================



// ======================================================
// Get Logged-in User Books
// GET /api/books/my-books
// Private Route
// ======================================================


// ======================================================
// Update Book
// PUT /api/books/:id
// Private Route (owner only)
// ======================================================

const updateBook = async (req, res) => {

    try {

        // ===========================
        // Validate ID Format
        // ===========================

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid book id."
            });

        }

        // ===========================
        // Find Book
        // ===========================

        const book = await Book.findOne({ _id: req.params.id, isDeleted: false });

        if (!book) {

            return res.status(404).json({
                success: false,
                message: "Book not found."
            });

        }

        // ===========================
        // Check Ownership
        // ===========================

        if (book.owner.toString() !== req.user._id.toString()) {

            return res.status(403).json({
                success: false,
                message: "You can update only your own books."
            });

        }

        // ===========================
        // Allowed Text/Select Fields
        // (coverImage and tags are handled separately below)
        // ===========================

        const updatableFields = [
            "title",
            "author",
            "category",
            "description",
            "condition",
            "language",
            "publisher",
            "publishedYear",
            "isbn",
            "status",
            "location"
        ];

        updatableFields.forEach((field) => {
            if (req.body[field] !== undefined && req.body[field] !== "") {
                book[field] = req.body[field];
            }
        });

        if (req.body.tags !== undefined) {
            book.tags = parseTags(req.body.tags);
        }

        // ===========================
        // Cover Image — Replace / Remove / Keep
        // ===========================

        if (req.file) {

            // A new image was uploaded — swap it in and delete the old one.
            deleteImageFile(book.coverImage);
            book.coverImage = `uploads/${req.file.filename}`;

        } else if (req.body.removeImage === "true") {

            deleteImageFile(book.coverImage);
            book.coverImage = "";

        }
        // Otherwise: no file + no removeImage flag → keep the existing image.

        const updatedBook = await book.save();

        res.status(200).json({

            success: true,
            message: "Book updated successfully.",
            book: updatedBook

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
// Delete Book (Soft Delete)
// DELETE /api/books/:id
// Private Route
// ======================================================

const deleteBook = async (req, res) => {

    try {

        // ===========================
        // Validate ID Format
        // ===========================

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid book id."
            });

        }

        // ===========================
        // Find Book
        // ===========================

        const book = await Book.findById(req.params.id);

        if (!book || book.isDeleted) {

            return res.status(404).json({

                success: false,

                message: "Book not found."

            });

        }

        // ===========================
        // Check Ownership
        // ===========================

        if (book.owner.toString() !== req.user._id.toString()) {

            return res.status(403).json({

                success: false,

                message: "You can delete only your own books."

            });

        }

        // ===========================
        // Soft Delete
        // ===========================

        book.isDeleted = true;

        await book.save();

        // ===========================
        // Success Response
        // ===========================

        res.status(200).json({

            success: true,

            message: "Book deleted successfully."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// Restore deleted book
const restoreBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findByIdAndUpdate(
            id,
            {
                isDeleted: false
            },
            {
                new: true
            }
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book restored successfully",
            book
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Permanently delete book from database
const permanentDeleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findByIdAndDelete(id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        // The DB record is gone — don't leave the image file orphaned on disk.
        deleteImageFile(book.coverImage);

        res.status(200).json({
            message: "Book permanently deleted",
            book
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {

    addBook,

    getAllBooks,

    getBookById,

    getMyBooks,

    getStats,

    updateBook,

    deleteBook,

    restoreBook,

    permanentDeleteBook

};