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
const favoriteRoutes = require("./routes/favoriteRoutes");

// ======================
// Error Middleware
// ======================

const errorMiddleware = require("./middleware/errorMiddleware");

// ======================
// Express App
// ======================

const app = express();

// ======================
// Trust Proxy
// ======================
// Required on Vercel (and most PaaS hosts): the app sits behind a proxy,
// so req.ip / X-Forwarded-For need this to be set correctly. Without it,
// express-rate-limit sees every request as coming from the same IP and
// either rate-limits everyone together or throws a validation error.
app.set("trust proxy", 1);

// ======================
// Connect Database
// ======================
// On a serverless platform, module-level code runs on cold start and the
// connection is reused across warm invocations (mongoose caches it
// internally), so this still works correctly without calling connectDB()
// again per-request.

connectDB().then(() => {
    // Mongoose queues model operations until the connection is ready
    // regardless, but running this after connectDB() resolves keeps the
    // startup log order sensible (DB connected, then admin bootstrapped).
    const seedAdmin = require("./config/seedAdmin");
    seedAdmin();
});

// ======================
// Security Middleware
// ======================

// Helps secure Express apps.
// NOTE: helmet's default Cross-Origin-Resource-Policy is "same-origin",
// which makes browsers REFUSE TO RENDER images/files served from this API
// when they're loaded from a different origin (e.g. the frontend on
// localhost:5173 loading an <img> from the backend on localhost:5000 —
// different port = different origin). The request itself still succeeds
// (you'll see a 200 in the server log), but the browser silently blocks
// the response from being used, showing a broken image. Setting the
// policy to "cross-origin" fixes this without weakening anything else
// helmet does.
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compresses API responses
app.use(compression());

// Allows frontend to access backend
// FRONTEND_URL restricts this to your deployed frontend in production.
// If it's not set, CORS falls back to allowing any origin (fine for local
// dev, not recommended once this is live on the public internet).
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
    : true;

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Shows requests in terminal
app.use(morgan("dev"));

// Read JSON
app.use(express.json());

// Read Form Data
app.use(express.urlencoded({ extended: true }));

// Safety net: if a request arrives with no matching Content-Type
// (e.g. a client that forgets to set "Content-Type: application/json"),
// express.json()/urlencoded() leave req.body as undefined rather than {}.
// Normalize it so every controller can safely destructure req.body
// without crashing with "Cannot destructure property 'x' of 'req.body'
// as it is undefined."
app.use((req, res, next) => {
    if (!req.body) req.body = {};
    next();
});

// Upload Folder
app.use("/uploads", express.static("uploads"));

// ======================
// Rate Limiter
// ======================
// See middleware/rateLimiters.js — this is the generous general limiter;
// a separate, much stricter limiter is applied only to /api/auth's
// login/register routes (see routes/authRoutes.js).

const { generalLimiter } = require("./middleware/rateLimiters");

app.use(generalLimiter);

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

app.use("/api/favorites", favoriteRoutes);

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

// Only listen on a port for local dev / traditional hosts (Render, Railway,
// a VPS, etc). On Vercel, this file is imported by api/index.js and the
// platform calls the exported `app` directly as a request handler per
// invocation — it never runs `node server.js`, so this block is skipped.
if (require.main === module) {
    app.listen(PORT, () => {

        console.log("====================================");
        console.log(`🚀 Server Running`);
        console.log(`🌐 http://localhost:${PORT}`);
        console.log("====================================");

    });
}

module.exports = app;


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