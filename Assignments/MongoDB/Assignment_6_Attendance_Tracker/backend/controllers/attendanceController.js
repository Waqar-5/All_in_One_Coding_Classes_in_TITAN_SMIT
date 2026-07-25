// controllers/attendanceController.js
// Contains all business logic for the Attendance resource.
// Each function is wrapped with asyncHandler to avoid repetitive try/catch.
//
// OWNERSHIP MODEL:
// Every attendance record has a `createdBy` field tied to the logged-in
// user who created it. Regular users ("teacher" role) only ever see and
// manage their OWN records. Users with the "admin" role can see and manage
// EVERY record. This is enforced centrally via the `buildOwnershipFilter`
// and `assertCanAccessRecord` helpers below, so it can't be forgotten in
// any individual route.

const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../middleware/ApiError');

/**
 * Returns a Mongo filter fragment that scopes queries to the current user,
 * unless that user is an admin (in which case no ownership restriction
 * is applied and they can see everyone's records).
 */
const buildOwnershipFilter = (req) => {
  if (req.user.role === 'admin') return {};
  return { createdBy: req.user._id };
};

/**
 * Throws a 403 if the given record does not belong to the current user
 * and the current user is not an admin.
 */
const assertCanAccessRecord = (req, record) => {
  const isOwner = record.createdBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'You are not authorized to access this record');
  }
};

/**
 * @desc    Create a new attendance record (owned by the logged-in user)
 * @route   POST /api/attendance
 * @access  Private
 */
const createAttendance = asyncHandler(async (req, res) => {
  const { studentName, date, status } = req.body;

  if (!studentName || !status) {
    throw new ApiError(400, 'Student name and status are required');
  }

  const attendance = await Attendance.create({
    studentName: studentName.trim(),
    date: date || Date.now(),
    status,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Attendance record created successfully',
    data: attendance,
  });
});

/**
 * @desc    Get attendance records with optional search, filter, sort & pagination.
 *          Regular users only see their own records; admins see everyone's.
 * @route   GET /api/attendance
 * @query   search, status, date, sortBy, order, page, limit
 * @access  Private
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

  // Start with the ownership scope, then layer on search/filter params
  const filter = { ...buildOwnershipFilter(req) };

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
 * @desc    Get a single attendance record by ID (must be owned by the
 *          requesting user, unless they're an admin)
 * @route   GET /api/attendance/:id
 * @access  Private
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

  assertCanAccessRecord(req, record);

  res.status(200).json({
    success: true,
    data: record,
  });
});

/**
 * @desc    Update an attendance record (must be owned by the requesting
 *          user, unless they're an admin)
 * @route   PUT /api/attendance/:id
 * @access  Private
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

  assertCanAccessRecord(req, record);

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
 * @desc    Delete an attendance record (must be owned by the requesting
 *          user, unless they're an admin)
 * @route   DELETE /api/attendance/:id
 * @access  Private
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

  assertCanAccessRecord(req, record);

  await record.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Attendance record deleted successfully',
    data: { _id: id },
  });
});

/**
 * @desc    Get attendance statistics (total, present, absent, percentage).
 *          Scoped to the logged-in user's own records, unless they're an admin.
 * @route   GET /api/attendance/count
 * @access  Private
 */
const getAttendanceStats = asyncHandler(async (req, res) => {
  const ownershipFilter = buildOwnershipFilter(req);

  const [total, present, absent] = await Promise.all([
    Attendance.countDocuments({ ...ownershipFilter }),
    Attendance.countDocuments({ ...ownershipFilter, status: 'Present' }),
    Attendance.countDocuments({ ...ownershipFilter, status: 'Absent' }),
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
