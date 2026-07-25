// routes/attendanceRoutes.js
// Defines all REST endpoints for the Attendance resource.
// NOTE: The '/count' route must be declared BEFORE the '/:id' route,
// otherwise Express would treat "count" as an :id parameter.

const express = require('express');
const router = express.Router();

const {
  createAttendance,
  getAttendanceRecords,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getAttendanceStats,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');

// All attendance routes require a valid logged-in user
router.use(protect);

// GET /api/attendance/count -> statistics (must come before /:id)
router.get('/count', getAttendanceStats);

// POST /api/attendance -> create | GET /api/attendance -> list (search/filter/sort/paginate)
router.route('/').post(createAttendance).get(getAttendanceRecords);

// GET /api/attendance/:id -> single | PUT -> update | DELETE -> delete
router
  .route('/:id')
  .get(getAttendanceById)
  .put(updateAttendance)
  .delete(deleteAttendance);

module.exports = router;
