// sample-data/seed.js
// Optional helper script to populate the database with a demo user and
// sample attendance records (owned by that demo user) for testing purposes.
//
// Usage (from the backend/ folder):
//   node sample-data/seed.js
//
// After seeding, log in with:
//   email: demo@attendancepro.com
//   password: demo1234

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const sampleData = require('./attendance.sample.json');

const DEMO_EMAIL = 'demo@attendancepro.com';
const DEMO_PASSWORD = 'demo1234';

const seed = async () => {
  await connectDB();

  try {
    // Create (or reuse) a demo user to own the sample attendance records
    let demoUser = await User.findOne({ email: DEMO_EMAIL });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Demo Admin',
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        role: 'admin',
      });
      console.log(`✅ Created demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
    } else {
      console.log(`ℹ️  Demo user already exists: ${DEMO_EMAIL}`);
    }

    // Clear only this demo user's previous sample records (safe to re-run)
    await Attendance.deleteMany({ createdBy: demoUser._id });
    console.log("🗑️  Cleared demo user's existing attendance records");

    const recordsWithOwner = sampleData.map((record) => ({
      ...record,
      createdBy: demoUser._id,
    }));

    const inserted = await Attendance.insertMany(recordsWithOwner);
    console.log(`✅ Inserted ${inserted.length} sample attendance records for ${DEMO_EMAIL}`);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

seed();
