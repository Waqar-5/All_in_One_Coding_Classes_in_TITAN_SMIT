// ======================================================
// Global Error Handling Middleware
// Catches errors passed via next(err) or thrown in async
// routes (Express 5 auto-forwards rejected promises here)
// ======================================================

const errorMiddleware = (err, req, res, next) => {

    console.error("🔥 Error:", err.message);

    // ===========================
    // Mongoose Bad ObjectId
    // ===========================

    if (err.name === "CastError") {

        return res.status(400).json({
            success: false,
            message: `Invalid ${err.path}: ${err.value}`
        });

    }

    // ===========================
    // Mongoose Validation Error
    // ===========================

    if (err.name === "ValidationError") {

        const messages = Object.values(err.errors).map((val) => val.message);

        return res.status(400).json({
            success: false,
            message: messages.join(", ")
        });

    }

    // ===========================
    // Multer Upload Errors
    // ===========================

    if (err.name === "MulterError") {

        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File is too large. Images should be under 5 MB and PDFs under 15 MB."
            });
        }

        return res.status(400).json({
            success: false,
            message: err.message || "There was a problem with the uploaded image."
        });

    }

    // ===========================
    // Mongoose Duplicate Key
    // ===========================

    if (err.code === 11000) {

        const field = Object.keys(err.keyValue || {})[0];

        return res.status(400).json({
            success: false,
            message: `Duplicate value for field: ${field}`
        });

    }

    // ===========================
    // JWT Errors
    // ===========================

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });

    }

    // ===========================
    // Fallback
    // ===========================

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });

};

module.exports = errorMiddleware;
