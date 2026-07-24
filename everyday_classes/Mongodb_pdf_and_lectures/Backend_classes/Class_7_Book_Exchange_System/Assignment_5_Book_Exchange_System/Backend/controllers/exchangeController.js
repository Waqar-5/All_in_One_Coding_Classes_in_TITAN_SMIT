// ======================================================
// Exchange Controller
// ======================================================

const mongoose = require("mongoose");
const Exchange = require("../models/Exchange");
const Book = require("../models/book");

// ======================================================
// Request A Book Exchange
// POST /api/exchange/:bookId
// Private Route
// ======================================================

const requestExchange = async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.bookId)) {
            return res.status(400).json({ success: false, message: "Invalid book id." });
        }

        const book = await Book.findOne({ _id: req.params.bookId, isDeleted: false });

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found." });
        }

        if (book.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: "You can't request your own book." });
        }

        if (book.status !== "Available") {
            return res.status(400).json({ success: false, message: "This book isn't available right now." });
        }

        const existing = await Exchange.findOne({
            book: book._id,
            requester: req.user._id,
            status: "Pending"
        });

        if (existing) {
            return res.status(400).json({ success: false, message: "You've already requested this book." });
        }

        const exchange = await Exchange.create({
            book: book._id,
            requester: req.user._id,
            owner: book.owner,
            message: req.body.message || ""
        });

        book.status = "Requested";
        await book.save();

        res.status(201).json({
            success: true,
            message: "Exchange request sent.",
            exchange
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};

// ======================================================
// Get Requests I've Sent
// GET /api/exchange/sent
// Private Route
// ======================================================

const getSentRequests = async (req, res) => {

    try {

        const requests = await Exchange.find({ requester: req.user._id })
            .populate("book", "title author category status")
            .populate("owner", "name email city")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, requests });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};

// ======================================================
// Get Requests Received For My Books
// GET /api/exchange/received
// Private Route
// ======================================================

const getReceivedRequests = async (req, res) => {

    try {

        const requests = await Exchange.find({ owner: req.user._id })
            .populate("book", "title author category status")
            .populate("requester", "name email city")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, requests });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};

// ======================================================
// Respond To A Request (Accept / Reject)
// PATCH /api/exchange/:id
// Private Route (only the book owner)
// ======================================================

const respondToExchange = async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid request id." });
        }

        const { action } = req.body; // "accept" | "reject"

        const exchange = await Exchange.findById(req.params.id);

        if (!exchange) {
            return res.status(404).json({ success: false, message: "Request not found." });
        }

        if (exchange.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "You can only respond to requests for your own books." });
        }

        if (exchange.status !== "Pending") {
            return res.status(400).json({ success: false, message: "This request has already been resolved." });
        }

        const book = await Book.findById(exchange.book);

        if (action === "accept") {

            exchange.status = "Accepted";
            if (book) {
                book.status = "Exchanged";
                await book.save();
            }

            // Auto-reject any other pending requests for the same book
            await Exchange.updateMany(
                { book: exchange.book, _id: { $ne: exchange._id }, status: "Pending" },
                { status: "Rejected" }
            );

        } else if (action === "reject") {

            exchange.status = "Rejected";
            if (book && book.status === "Requested") {
                book.status = "Available";
                await book.save();
            }

        } else {
            return res.status(400).json({ success: false, message: "Action must be 'accept' or 'reject'." });
        }

        await exchange.save();

        res.status(200).json({ success: true, message: `Request ${exchange.status.toLowerCase()}.`, exchange });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};

// ======================================================
// Cancel A Request I Sent
// PATCH /api/exchange/:id/cancel
// Private Route (only the requester)
// ======================================================

const cancelExchange = async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid request id." });
        }

        const exchange = await Exchange.findById(req.params.id);

        if (!exchange) {
            return res.status(404).json({ success: false, message: "Request not found." });
        }

        if (exchange.requester.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "You can only cancel your own requests." });
        }

        if (exchange.status !== "Pending") {
            return res.status(400).json({ success: false, message: "This request has already been resolved." });
        }

        exchange.status = "Cancelled";
        await exchange.save();

        const book = await Book.findById(exchange.book);
        if (book && book.status === "Requested") {
            book.status = "Available";
            await book.save();
        }

        res.status(200).json({ success: true, message: "Request cancelled." });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};

module.exports = {
    requestExchange,
    getSentRequests,
    getReceivedRequests,
    respondToExchange,
    cancelExchange
};
