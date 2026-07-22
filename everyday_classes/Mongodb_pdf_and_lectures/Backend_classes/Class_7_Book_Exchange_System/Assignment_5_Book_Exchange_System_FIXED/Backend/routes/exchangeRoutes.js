// ======================================================
// Exchange Routes
// ======================================================

const express = require("express");
const router = express.Router();

const {
    requestExchange,
    getSentRequests,
    getReceivedRequests,
    respondToExchange,
    cancelExchange
} = require("../controllers/exchangeController");

const { protect } = require("../middleware/authMiddleware");

// All exchange routes require a logged-in user

// Send a request for a book
// POST /api/exchange/:bookId
router.post("/:bookId", protect, requestExchange);

// Requests I've sent
// GET /api/exchange/sent
router.get("/sent", protect, getSentRequests);

// Requests received for my books
// GET /api/exchange/received
router.get("/received", protect, getReceivedRequests);

// Accept or reject a request (book owner only)
// PATCH /api/exchange/:id
router.patch("/:id", protect, respondToExchange);

// Cancel a request I sent
// PATCH /api/exchange/:id/cancel
router.patch("/:id/cancel", protect, cancelExchange);

module.exports = router;
