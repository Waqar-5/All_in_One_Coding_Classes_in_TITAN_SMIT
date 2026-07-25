// models/Attendance.js
// Mongoose schema/model for the "attendance" collection.

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Student name must be at least 2 characters long'],
      maxlength: [100, 'Student name cannot exceed 100 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: ['Present', 'Absent'],
        message: 'Status must be either "Present" or "Absent"',
      },
      required: [true, 'Status is required'],
    },
    // Owner of this record — the logged-in user who created it.
    // Used to scope "GET all" queries so users only see their own records
    // (admins can see everything — see attendanceController.js).
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'createdBy is required'],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

// Index to speed up common queries (search by name, filter by date/status/owner)
attendanceSchema.index({ studentName: 1 });
attendanceSchema.index({ date: -1 });
attendanceSchema.index({ status: 1 });
attendanceSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
