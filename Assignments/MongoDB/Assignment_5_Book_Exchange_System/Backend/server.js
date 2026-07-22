// ======================================================
// BOOK EXCHANGE BACKEND SERVER
// ======================================================

// ======================
// Core Packages
// ======================

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// ======================
// Load Environment Variables
// ======================

dotenv.config();

// ======================
// Database Connection
// ======================

const connectDB = require("./config/db");

// ======================
// Routes
// ======================

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const exchangeRoutes = require("./routes/exchangeRoutes");

// ======================
// Error Middleware
// ======================

const errorMiddleware = require("./middleware/errorMiddleware");

// ======================
// Express App
// ======================

const app = express();

// ======================
// Connect Database
// ======================

connectDB();

// ======================
// Security Middleware
// ======================

// Helps secure Express apps
app.use(helmet());

// Compresses API responses
app.use(compression());

// Allows frontend to access backend
app.use(cors());

// Shows requests in terminal
app.use(morgan("dev"));

// Read JSON
app.use(express.json());

// Read Form Data
app.use(express.urlencoded({ extended: true }));

// Upload Folder
app.use("/uploads", express.static("uploads"));

// ======================
// Rate Limiter
// ======================

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use(limiter);

// ======================
// Home Route
// ======================

app.get("/", (req, res) => {

    res.status(200).json({

        success: true,
        message: "📚 Book Exchange API Running Successfully"

    });

});

// ======================
// API Routes
// ======================

app.use("/api/auth", authRoutes);

app.use("/api/books", bookRoutes);

app.use("/api/exchange", exchangeRoutes);

// ======================
// 404 Route
// ======================

app.use((req, res) => {

    res.status(404).json({

        success: false,
        message: "Route Not Found"

    });

});

// ======================
// Global Error Middleware
// ======================

app.use(errorMiddleware);

// ======================
// Server
// ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("====================================");
    console.log(`🚀 Server Running`);
    console.log(`🌐 http://localhost:${PORT}`);
    console.log("====================================");

});


// // ======================
// // Install Packages
// // ======================

// // npm install express
// // npm install mongoose
// // npm install dotenv
// // npm install cors
// // npm install -g nodemon

// // ======================

// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const Book = require('./models/book');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // ======================
// // Middleware
// // ======================

// app.use(cors());
// app.use(express.json());

// // ======================
// // MongoDB Connection
// // ======================

// mongoose.connect(process.env.MONGO_URI)
// .then(()=>{
//     console.log("MongoDB Connected Successfully");
// })
// .catch((err)=>{
//     console.log(err.message);
// });

// // ======================================================
// // Add Book API
// // POST /books
// // ======================================================

// app.post("/books", async(req,res)=>{

//     try{

//         const {title,author,category,owner,status}=req.body;

//         // Validation

//         if(!title || !author || !category || !owner){

//             return res.status(400).json({
//                 message:"All fields are required"
//             });

//         }

//         // Create Book

//         const newBook=await Book.create({

//             title,
//             author,
//             category,
//             owner,
//             status

//         });

//         res.status(201).json({

//             message:"Book Added Successfully",
//             book:newBook

//         });

//     }

//     catch(error){

//         res.status(500).json({

//             message:error.message

//         });

//     }

// });


// // ======================================================
// // Get All Books
// // GET /books
// // ======================================================

// app.get("/books",async(req,res)=>{

//     try{

//         const books=await Book.find();

//         res.status(200).json(books);

//     }

//     catch(error){

//         res.status(500).json({

//             message:error.message

//         });

//     }

// });


// // ======================================================
// // Get Single Book
// // GET /books/:id
// // ======================================================

// app.get("/books/:id",async(req,res)=>{

//     try{

//         const book=await Book.findById(req.params.id);

//         if(!book){

//             return res.status(404).json({

//                 message:"Book not found"

//             });

//         }

//         res.status(200).json(book);

//     }

//     catch(error){

//         res.status(500).json({

//             message:error.message

//         });

//     }

// });


// // ======================================================
// // Update Book
// // PUT /books/:id
// // ======================================================

// app.put("/books/:id",async(req,res)=>{

//     try{

//         const {title,author,category,owner,status}=req.body;

//         const book=await Book.findById(req.params.id);

//         if(!book){

//             return res.status(404).json({

//                 message:"Book not found"

//             });

//         }

//         const updateData={};

//         if(title) updateData.title=title;
//         if(author) updateData.author=author;
//         if(category) updateData.category=category;
//         if(owner) updateData.owner=owner;
//         if(status) updateData.status=status;

//         if(Object.keys(updateData).length===0){

//             return res.status(400).json({

//                 message:"Please provide at least one field"

//             });

//         }

//         const updatedBook=await Book.findByIdAndUpdate(

//             req.params.id,
//             updateData,
//             {
//                 new:true,
//                 runValidators:true
//             }

//         );

//         res.status(200).json({

//             message:"Book Updated Successfully",
//             book:updatedBook

//         });

//     }

//     catch(error){

//         res.status(500).json({

//             message:error.message

//         });

//     }

// });


// // ======================================================
// // Delete Book
// // DELETE /books/:id
// // ======================================================

// app.delete("/books/:id",async(req,res)=>{

//     try{

//         const deletedBook=await Book.findByIdAndDelete(req.params.id);

//         if(!deletedBook){

//             return res.status(404).json({

//                 message:"Book not found"

//             });

//         }

//         res.status(200).json({

//             message:"Book Deleted Successfully"

//         });

//     }

//     catch(error){

//         res.status(500).json({

//             message:error.message

//         });

//     }

// });


// // ======================================================
// // Search Book By Category
// // GET /books/category/:category
// // ======================================================

// app.get("/books/category/:category",async(req,res)=>{

//     try{

//         const books=await Book.find({

//             category:req.params.category

//         });

//         res.status(200).json(books);

//     }

//     catch(error){

//         res.status(500).json({

//             message:error.message

//         });

//     }

// });

// console.log(process.env.MONGO_URI);

// app.listen(PORT,()=>{

//     console.log(`🚀 Server Running on http://localhost:${PORT}`);

// });