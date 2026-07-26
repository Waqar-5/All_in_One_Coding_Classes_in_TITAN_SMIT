// ======================================================
// Book Model
// ======================================================

const mongoose = require("mongoose");

// ======================================================
// Book Schema
// ======================================================

const bookSchema = new mongoose.Schema({

    // ===========================
    // Book Title
    // ===========================

    title: {
        type: String,
        required: [true, "Book title is required"],
        trim: true,
        minlength: 2,
        maxlength: 100
    },

    // ===========================
    // Author Name
    // ===========================

    author: {
        type: String,
        required: [true, "Author name is required"],
        trim: true
    },

    // ===========================
    // Category
    // ===========================

    category: {
        type: String,
        required: [true, "Category is required"],
        enum: [
            "Programming",
            "Science",
            "Mathematics",
            "History",
            "Novel",
            "Biography",
            "Business",
            "Technology",
            "Other"
        ]
    },

    // ===========================
    // Description
    // ===========================

    description: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: ""
    },

    // ===========================
    // Book Cover Image
    // ===========================

    coverImage: {
        type: String,
        default: ""
    },

    // ===========================
    // Read Online Link
    // An external URL where the book can be read (e.g. a Google Books
    // preview, an online library, the author's own site, etc.)
    // ===========================

    readLink: {
        type: String,
        trim: true,
        default: ""
    },

    // ===========================
    // Uploaded PDF
    // Stored the same way as coverImage — a relative "uploads/..." path
    // ===========================

    pdfFile: {
        type: String,
        default: ""
    },

    // ===========================
    // Book Condition
    // ===========================

    condition: {
        type: String,
        enum: [
            "New",
            "Like New",
            "Good",
            "Fair",
            "Poor"
        ],
        default: "Good"
    },

    // ===========================
    // Book Language
    // ===========================

    language: {
        type: String,
        default: "English"
    },

    // ===========================
    // Publisher
    // ===========================

    publisher: {
        type: String,
        trim: true,
        default: ""
    },

    // ===========================
    // Published Year
    // ===========================

    publishedYear: {
        type: Number,
        min: 1000,
        max: new Date().getFullYear()
    },

    // ===========================
    // ISBN
    // ===========================

    isbn: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },

    // ===========================
    // Book Owner
    // Relation with User Model
    // ===========================

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // ===========================
    // Exchange Status
    // ===========================

    status: {
        type: String,
        enum: [
            "Available",
            "Requested",
            "Reserved",
            "Exchanged"
        ],
        default: "Available"
    },

    // ===========================
    // City / Location
    // ===========================

    location: {
        type: String,
        trim: true,
        default: ""
    },

    // ===========================
    // Search Tags
    // ===========================

    tags: [
        {
            type: String,
            trim: true
        }
    ],

    // ===========================
    // Number of Views
    // ===========================

    views: {
        type: Number,
        default: 0
    },

    // ===========================
    // Users Who Favorited
    // ===========================

    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    // ===========================
    // Soft Delete
    // ===========================

    isDeleted: {
        type: Boolean,
        default: false
    }

},
{
    timestamps: true
});

// ======================================================
// Export Model
// ======================================================

module.exports = mongoose.model("Book", bookSchema);


// const mongoose = require("mongoose");

// const bookSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//         trim: true
//     },

//     author: {
//         type: String,
//         required: true,
//         trim: true
//     },

//     category: {
//         type: String,
//         required: true,
//         trim: true
//     },

//     owner: {
//         type: String,
//         required: true,
//         trim: true
//     },

//     status: {
//         type: String,
//         enum: ["Available", "Exchanged"],
//         default: "Available"
//     }

// }, {
//     timestamps: true
// });

// module.exports = mongoose.model("Book", bookSchema);