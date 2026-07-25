// controllers/adminController.js
// Admin-only operations: viewing all registered users (with how many
// attendance records each has marked), blocking/unblocking accounts, and
// promoting/demoting a user's role. Every route here is protected by
// `protect` + `authorize('admin')` in routes/adminRoutes.js.

const mongoose = require('mongoose');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../middleware/ApiError');
const { isSuperAdminEmail } = require('../utils/superAdmin');

/**
 * @desc    Get every registered user, along with how many attendance
 *          records each one has personally marked.
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  // Aggregation: for each user, look up attendance records where
  // attendance.createdBy === user._id, then attach the count.
  const users = await User.aggregate([
    {
      $lookup: {
        from: 'attendances', // Mongoose pluralizes+lowercases the "Attendance" model name
        localField: '_id',
        foreignField: 'createdBy',
        as: 'attendanceRecords',
      },
    },
    {
      $addFields: {
        recordsMarked: { $size: '$attendanceRecords' },
      },
    },
    {
      $project: {
        password: 0,
        attendanceRecords: 0, // don't send the full record list, just the count
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  // Flag which row is the permanent super admin so the UI can show a
  // "Protected" badge and disable block/role-change actions for it.
  const usersWithFlag = users.map((u) => ({
    ...u,
    isSuperAdmin: isSuperAdminEmail(u.email),
  }));

  res.status(200).json({
    success: true,
    count: usersWithFlag.length,
    data: usersWithFlag,
  });
});

/**
 * @desc    Get a single user's basic profile plus how many attendance
 *          records they've marked — used as the header info for the
 *          Admin Panel's per-user detail view.
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid user ID format');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const recordsMarked = await Attendance.countDocuments({ createdBy: user._id });

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      attendanceLimit: user.attendanceLimit,
      createdAt: user.createdAt,
      recordsMarked,
      isSuperAdmin: isSuperAdminEmail(user.email),
    },
  });
});

/**
 * @desc    Block a user — they will be immediately unable to log in or
 *          use any existing session (enforced in the `protect` middleware).
 *          The permanent super admin can never be blocked.
 * @route   PUT /api/admin/users/:id/block
 * @access  Private/Admin
 */
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid user ID format');
  }

  if (id === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot block your own account');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (isSuperAdminEmail(user.email)) {
    throw new ApiError(403, 'This account is protected and cannot be blocked');
  }

  user.isBlocked = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: `${user.email} has been blocked and can no longer log in`,
    data: { _id: user._id, isBlocked: user.isBlocked },
  });
});

/**
 * @desc    Unblock a previously blocked user, restoring their login access.
 * @route   PUT /api/admin/users/:id/unblock
 * @access  Private/Admin
 */
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid user ID format');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.isBlocked = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: `${user.email} has been unblocked`,
    data: { _id: user._id, isBlocked: user.isBlocked },
  });
});

/**
 * @desc    Change a user's role between "admin" and "teacher".
 *          The permanent super admin's role can never be changed, and an
 *          admin cannot demote themselves (to avoid accidentally locking
 *          themselves out of the admin panel).
 * @route   PUT /api/admin/users/:id/role
 * @body    { role: "admin" | "teacher" }
 * @access  Private/Admin
 */
const changeUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid user ID format');
  }

  if (!['admin', 'teacher'].includes(role)) {
    throw new ApiError(400, 'Role must be either "admin" or "teacher"');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (isSuperAdminEmail(user.email)) {
    throw new ApiError(403, "This account's role is protected and cannot be changed");
  }

  if (id === req.user._id.toString() && role !== 'admin') {
    throw new ApiError(400, 'You cannot demote your own account');
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: `${user.email} is now a${role === 'admin' ? 'n' : ''} ${role}`,
    data: { _id: user._id, role: user.role },
  });
});

/**
 * @desc    Set (or clear) a user's attendance record creation limit.
 *          A limit of 0 means unlimited. This has no effect on admin
 *          accounts, since admins always bypass the limit check entirely.
 * @route   PUT /api/admin/users/:id/limit
 * @body    { limit: number }  (0 = unlimited)
 * @access  Private/Admin
 */
const setUserLimit = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { limit } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid user ID format');
  }

  const limitNum = Number(limit);
  if (Number.isNaN(limitNum) || limitNum < 0) {
    throw new ApiError(400, 'Limit must be a number 0 or greater (0 = unlimited)');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.attendanceLimit = limitNum;
  await user.save();

  res.status(200).json({
    success: true,
    message:
      limitNum === 0
        ? `${user.email} now has an unlimited attendance record limit`
        : `${user.email}'s attendance record limit is now ${limitNum}`,
    data: { _id: user._id, attendanceLimit: user.attendanceLimit },
  });
});

module.exports = { getAllUsers, getUserById, blockUser, unblockUser, changeUserRole, setUserLimit };
