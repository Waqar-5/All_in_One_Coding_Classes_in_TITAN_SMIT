// ======================================================
// MongoDB Database Connection
// ======================================================

const mongoose = require("mongoose");

// ======================================================
// Connect Database Function
// ======================================================

const connectDB = async () => {

    try {

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        console.log("====================================");
        console.log("✅ MongoDB Connected Successfully");
        console.log(`📂 Database : ${mongoose.connection.name}`);
        console.log(`🌍 Host     : ${mongoose.connection.host}`);
        console.log("====================================");

    }

    catch (error) {

        console.log("====================================");
        console.log("❌ MongoDB Connection Failed");
        console.log(error.message);
        console.log("====================================");

        process.exit(1);

    }

};

// ======================================================
// Export
// ======================================================

module.exports = connectDB;