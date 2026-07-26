// ======================================================
// Book Controller
// ======================================================

const mongoose = require("mongoose");
const Book = require("../models/book");
const User = require("../models/User");
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
            status,
            readLink

        } = req.body;

        // req.files comes from upload.fields([{ name: "image" }, { name: "pdfFile" }])
        // — each is an array (even with maxCount: 1), or undefined if not sent.
        const imageFile = req.files?.image?.[0];
        const pdfFile = req.files?.pdfFile?.[0];

        // Cleans up anything Multer already wrote to disk before a later
        // validation check fails, so nothing gets orphaned in /uploads.
        const cleanupUploadedFiles = () => {
            if (imageFile) deleteImageFile(`uploads/${imageFile.filename}`);
            if (pdfFile) deleteImageFile(`uploads/${pdfFile.filename}`);
        };

        // ===========================
        // Required Validation
        // ===========================

        if (

            !title ||

            !author ||

            !category

        ) {

            cleanupUploadedFiles();

            return res.status(400).json({

                success: false,

                message: "Title, Author and Category are required."

            });

        }

        // ===========================
        // Book Cover Image Is Required
        // ===========================

        if (!imageFile) {

            cleanupUploadedFiles();

            return res.status(400).json({

                success: false,

                message: "Book image is required."

            });

        }

        // ===========================
        // Book Listing Limit
        // req.user.bookLimit is a specific override an admin set for this
        // account; if it's null, fall back to DEFAULT_BOOK_LIMIT from .env
        // (see authController.updateUserBookLimit).
        // ===========================

        const effectiveLimit =
            req.user.bookLimit !== null && req.user.bookLimit !== undefined
                ? req.user.bookLimit
                : Number(process.env.DEFAULT_BOOK_LIMIT) || null;

        if (effectiveLimit !== null) {

            const currentBookCount = await Book.countDocuments({
                owner: req.user._id,
                isDeleted: false
            });

            if (currentBookCount >= effectiveLimit) {

                cleanupUploadedFiles();

                return res.status(403).json({

                    success: false,

                    message: `You've reached your book listing limit (${effectiveLimit}). Contact an admin to increase it.`

                });

            }

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

            readLink: readLink || "",

            coverImage: `uploads/${imageFile.filename}`,

            pdfFile: pdfFile ? `uploads/${pdfFile.filename}` : "",

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

const SORT_OPTIONS = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    az: { title: 1 },
    za: { title: -1 },
    updated: { updatedAt: -1 }
};

const getAllBooks = async (req, res) => {

    try {

        // ===========================
        // Query Parameters
        // ===========================

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const { search, category, condition, language, status, city } = req.query;

        const sortBy = SORT_OPTIONS[req.query.sort] || SORT_OPTIONS.newest;

        // ===========================
        // Build Filter Query
        // ===========================

        const query = { isDeleted: false };

        // Public catalog defaults to "Available" (a marketplace of what
        // can actually be requested). An explicit ?status= lets the
        // Browse page look at a specific other state, and ?status=All
        // removes the filter entirely (shows every status).
        if (status && status !== "All") {
            query.status = status;
        } else if (!status) {
            query.status = "Available";
        }
        // status === "All" → no status filter applied at all.

        if (category) query.category = category;
        if (condition) query.condition = condition;
        if (language) query.language = language;
        if (city) query.location = { $regex: city, $options: "i" };

        if (search) {

            const regex = { $regex: search, $options: "i" };

            // Owner is a reference, not a plain field — resolve matching
            // user ids separately so we can search by owner name too.
            const matchingOwners = await User.find({ name: regex }).select("_id");
            const ownerIds = matchingOwners.map((u) => u._id);

            query.$or = [
                { title: regex },
                { author: regex },
                { category: regex },
                { isbn: regex },
                { tags: regex },
                { location: regex },
                ...(ownerIds.length ? [{ owner: { $in: ownerIds } }] : [])
            ];

        }

        // ===========================
        // Find Books
        // ===========================

        const books = await Book.find(query)

        .populate(

            "owner",

            "name email city profileImage"

        )

        .sort(sortBy)

        .skip(skip)

        .limit(limit);

        // ===========================
        // Total Books
        // ===========================

        const totalBooks = await Book.countDocuments(query);

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

        // readLink is allowed to be cleared to an empty string (unlike
        // the fields above, which skip blank values on purpose).
        if (req.body.readLink !== undefined) {
            book.readLink = req.body.readLink;
        }

        const imageFile = req.files?.image?.[0];
        const pdfFile = req.files?.pdfFile?.[0];

        // ===========================
        // Cover Image — Replace / Remove / Keep
        // ===========================

        if (imageFile) {

            // A new image was uploaded — swap it in and delete the old one.
            deleteImageFile(book.coverImage);
            book.coverImage = `uploads/${imageFile.filename}`;

        } else if (req.body.removeImage === "true") {

            deleteImageFile(book.coverImage);
            book.coverImage = "";

        }
        // Otherwise: no file + no removeImage flag → keep the existing image.

        // ===========================
        // PDF — Replace / Remove / Keep
        // ===========================

        if (pdfFile) {

            deleteImageFile(book.pdfFile);
            book.pdfFile = `uploads/${pdfFile.filename}`;

        } else if (req.body.removePdf === "true") {

            deleteImageFile(book.pdfFile);
            book.pdfFile = "";

        }

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


// ======================================================
// Get All Books (Admin — includes soft-deleted)
// GET /api/books/admin/all
// Admin Route
// ======================================================

const getAllBooksAdmin = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const { search } = req.query;

        const query = {};

        if (search) {
            const regex = { $regex: search, $options: "i" };
            query.$or = [{ title: regex }, { author: regex }, { isbn: regex }];
        }

        const books = await Book.find(query)
            .populate("owner", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBooks = await Book.countDocuments(query);

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
// Restore Soft-Deleted Book
// PATCH /api/books/restore/:id
// Admin Route
// ======================================================

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

        // The DB record is gone — don't leave the image/PDF files orphaned on disk.
        deleteImageFile(book.coverImage);
        deleteImageFile(book.pdfFile);

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

    getAllBooksAdmin,

    updateBook,

    deleteBook,

    restoreBook,

    permanentDeleteBook

};