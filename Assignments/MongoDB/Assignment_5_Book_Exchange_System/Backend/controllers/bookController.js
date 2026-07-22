// ======================================================
// Book Controller
// ======================================================

const Book = require("../models/Book");

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
            tags

        } = req.body;

        // ===========================
        // Required Validation
        // ===========================

        if (

            !title ||

            !author ||

            !category

        ) {

            return res.status(400).json({

                success: false,

                message: "Title, Author and Category are required."

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

            publishedYear,

            isbn,

            location,

            tags,

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
// Delete Book (Soft Delete)
// DELETE /api/books/:id
// Private Route
// ======================================================

const deleteBook = async (req, res) => {

    try {

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

    deleteBook,

    restoreBook,

    permanentDeleteBook

};