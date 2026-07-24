// server.js
// Entry point for the Attendance Tracker backend API.

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const attendanceRoutes = require('./routes/attendanceRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ----------------- Global Middleware -----------------
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Simple request logger (helpful during development)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// ----------------- Routes -----------------
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🎯 Attendance Tracker API is running',
    version: '1.0.0',
  });
});

app.use('/api/attendance', attendanceRoutes);

// ----------------- Error Handling -----------------
app.use(notFound);
app.use(errorHandler);

// ----------------- Start Server -----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
});
