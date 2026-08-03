const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
require("dotenv").config();
const app = express();
// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
// ================= MONGODB =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Error:");
    console.error(err.message);
  });
// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
// ================= SERVER =================
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});