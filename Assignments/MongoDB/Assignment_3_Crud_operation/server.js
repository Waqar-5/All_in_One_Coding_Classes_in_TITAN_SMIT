// ================================
// Import Required Packages & Files
// ================================

// Import student routes
const studentRoutes = require("./routes/studentRoutes");

// Import Express framework
const express = require("express");

// Import dotenv to load environment variables from the .env file
const dotenv = require("dotenv");

// Import MongoDB connection function
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Create an Express application
const app = express();

// ===================================
// Middleware
// ===================================

// Built-in middleware that converts incoming JSON data
// into a JavaScript object.
// Without this, req.body will be undefined.
app.use(express.json());

// ===================================
// Connect to MongoDB Atlas
// ===================================

// Establish connection with the database before handling requests.
connectDB();

// ===================================
// Home Route
// ===================================

// Simple route to check whether the server is running.
app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Student Management API is Running 🚀"
    });

});

// ===================================
// Student Routes
// ===================================

// All student-related APIs will start with:
// /api/students
//
// Examples:
// POST   /api/students
// GET    /api/students
// GET    /api/students/:id
// PUT    /api/students/:id
// DELETE /api/students/:id
app.use("/api/students", studentRoutes);

// ===================================
// Server Port
// ===================================

// Use the port from .env if available;
// otherwise, use port 3000.
const PORT = process.env.PORT || 3000;

// ===================================
// Start Server
// ===================================

// Start the Express server and listen for incoming requests.
app.listen(PORT, () => {

    console.log(`🚀 Server Running on http://localhost:${PORT}`);

});