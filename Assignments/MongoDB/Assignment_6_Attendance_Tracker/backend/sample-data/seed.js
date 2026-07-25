// sample-data/seed.js
// Optional helper script to populate the database with:
//   1. A demo user + sample attendance records (for quickly trying the app)
//   2. The permanent super admin account (from SUPER_ADMIN_EMAIL in .env),
//      if it doesn't already exist
//
// Usage (from the backend/ folder):
//   node sample-data/seed.js
//
// After seeding, log in with either:
//   email: demo@attendancepro.com       password: demo1234
//   email: <your SUPER_ADMIN_EMAIL>     password: changeme123 (only if newly created)

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
const SUPER_ADMIN_DEFAULT_PASSWORD = 'changeme123';

const seed = async () => {
  await connectDB();

  try {
    // ---------- 1. Demo user + sample attendance data ----------
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

    // ---------- 2. Permanent super admin account (from .env) ----------
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    if (superAdminEmail) {
      const existingSuperAdmin = await User.findOne({ email: superAdminEmail.toLowerCase().trim() });
      if (!existingSuperAdmin) {
        await User.create({
          name: 'Super Admin',
          email: superAdminEmail.toLowerCase().trim(),
          password: SUPER_ADMIN_DEFAULT_PASSWORD,
          role: 'admin',
        });
        console.log(
          `✅ Created super admin account: ${superAdminEmail} / ${SUPER_ADMIN_DEFAULT_PASSWORD} — please log in and change this password.`
        );
      } else {
        console.log(`ℹ️  Super admin account already exists: ${superAdminEmail}`);
      }
    } else {
      console.log('⚠️  SUPER_ADMIN_EMAIL is not set in .env — skipping super admin creation.');
    }
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

seed();
