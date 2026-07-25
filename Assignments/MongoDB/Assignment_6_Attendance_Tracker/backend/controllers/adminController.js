// controllers/adminController.js
// Admin-only operations: viewing all registered users (with how many
// attendance records each has marked) and blocking/unblocking accounts.
// Every route here is protected by `protect` + `authorize('admin')`
// in routes/adminRoutes.js.

const mongoose = require('mongoose');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../middleware/ApiError');

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

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

/**
 * @desc    Block a user — they will be immediately unable to log in or
 *          use any existing session (enforced in the `protect` middleware).
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

module.exports = { getAllUsers, blockUser, unblockUser };
