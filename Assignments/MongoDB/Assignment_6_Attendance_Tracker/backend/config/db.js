// config/db.js
// Handles the MongoDB connection using Mongoose and environment variables.

const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the connection string defined in .env
 * Exits the process with failure if connection fails, since the API
 * cannot function without a database connection.
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    // Log connection issues that occur after the initial connection
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
