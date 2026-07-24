// sample-data/seed.js
// Optional helper script to populate the database with sample attendance
// records for demo/testing purposes.
//
// Usage (from the backend/ folder):
//   node sample-data/seed.js

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Attendance = require('../models/Attendance');
const sampleData = require('./attendance.sample.json');

const seed = async () => {
  await connectDB();

  try {
    await Attendance.deleteMany({});
    console.log('🗑️  Cleared existing attendance records');

    const inserted = await Attendance.insertMany(sampleData);
    console.log(`✅ Inserted ${inserted.length} sample attendance records`);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

seed();
