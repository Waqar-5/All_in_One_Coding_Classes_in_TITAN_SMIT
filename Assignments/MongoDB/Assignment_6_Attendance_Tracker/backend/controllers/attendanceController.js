// controllers/attendanceController.js
// Contains all business logic for the Attendance resource.
// Each function is wrapped with asyncHandler to avoid repetitive try/catch.

const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../middleware/ApiError');

/**
 * @desc    Create a new attendance record
 * @route   POST /api/attendance
 * @access  Public
 */
const createAttendance = asyncHandler(async (req, res) => {
  const { studentName, date, status } = req.body;

  if (!studentName || !status) {
    throw new ApiError(400, 'Student name and status are required');
  }

  // 👇 ADD THE DUPLICATE CHECK HERE

const attendanceDate = new Date(date || Date.now());

const startOfDay = new Date(attendanceDate);
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date(attendanceDate);
endOfDay.setHours(23, 59, 59, 999);

const existingAttendance = await Attendance.findOne({
  studentName: studentName.trim(),
  date: {
    $gte: startOfDay,
    $lte: endOfDay,
  },
});

if (existingAttendance) {
  throw new ApiError(
    400,
    "Attendance has already been marked for this student today."
  );
}
  const attendance = await Attendance.create({
    studentName: studentName.trim(),
    date: date || Date.now(),
    status,
  });

  res.status(201).json({
    success: true,
    message: 'Attendance record created successfully',
    data: attendance,
  });
});

/**
 * @desc    Get all attendance records with optional search, filter, sort & pagination
 * @route   GET /api/attendance
 * @query   search, status, date, sortBy, order, page, limit
 * @access  Public
 */
const getAttendanceRecords = asyncHandler(async (req, res) => {
  const {
    search = '',
    status = '',
    date = '',
    sortBy = 'date',
    order = 'desc',
    page = 1,
    limit = 10,
  } = req.query;

  // Build dynamic filter object
  const filter = {};

  if (search) {
    filter.studentName = { $regex: search, $options: 'i' };
  }

  if (status && ['Present', 'Absent'].includes(status)) {
    filter.status = status;
  }

  if (date) {
    // Match the whole day for the given date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    filter.date = { $gte: startOfDay, $lte: endOfDay };
  }

  // Whitelist sortable fields to prevent injection into sort object
  const allowedSortFields = ['studentName', 'date', 'status', 'createdAt'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'date';
  const sortOrder = order === 'asc' ? 1 : -1;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
  const skip = (pageNum - 1) * limitNum;

  const [records, total] = await Promise.all([
    Attendance.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limitNum),
    Attendance.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: records.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    data: records,
  });
});

/**
 * @desc    Get a single attendance record by ID
 * @route   GET /api/attendance/:id
 * @access  Public
 */
const getAttendanceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid attendance ID format');
  }

  const record = await Attendance.findById(id);

  if (!record) {
    throw new ApiError(404, 'Attendance record not found');
  }

  res.status(200).json({
    success: true,
    data: record,
  });
});

/**
 * @desc    Update an attendance record
 * @route   PUT /api/attendance/:id
 * @access  Public
 */
const updateAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { studentName, date, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid attendance ID format');
  }

  const record = await Attendance.findById(id);

  if (!record) {
    throw new ApiError(404, 'Attendance record not found');
  }

  if (studentName !== undefined) record.studentName = studentName.trim();
  if (date !== undefined) record.date = date;
  if (status !== undefined) record.status = status;

  const updatedRecord = await record.save();

  res.status(200).json({
    success: true,
    message: 'Attendance record updated successfully',
    data: updatedRecord,
  });
});

/**
 * @desc    Delete an attendance record
 * @route   DELETE /api/attendance/:id
 * @access  Public
 */
const deleteAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid attendance ID format');
  }

  const record = await Attendance.findById(id);

  if (!record) {
    throw new ApiError(404, 'Attendance record not found');
  }

  await record.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Attendance record deleted successfully',
    data: { _id: id },
  });
});

/**
 * @desc    Get attendance statistics (total, present, absent, percentage)
 * @route   GET /api/attendance/count
 * @access  Public
 */
const getAttendanceStats = asyncHandler(async (req, res) => {
  const [total, present, absent] = await Promise.all([
    Attendance.countDocuments({}),
    Attendance.countDocuments({ status: 'Present' }),
    Attendance.countDocuments({ status: 'Absent' }),
  ]);

  const percentage = total > 0 ? Number(((present / total) * 100).toFixed(2)) : 0;

  res.status(200).json({
    success: true,
    data: {
      total,
      present,
      absent,
      percentage,
    },
  });
});

module.exports = {
  createAttendance,
  getAttendanceRecords,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getAttendanceStats,
};
