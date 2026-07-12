// ===================================
// Import Mongoose
// ===================================

// Mongoose helps Node.js communicate with MongoDB.
const mongoose = require("mongoose");

// ===================================
// Student Schema
// ===================================

// A Schema defines the structure of every student document
// that will be stored in the MongoDB database.
const studentSchema = new mongoose.Schema(

  // Fields of the Student document
  {
    // Student Name
    name: {
      type: String, // Data type is String
      required: [true, "Student name is required"], // Cannot be empty
      trim: true, // Removes extra spaces
    },

    // Student Roll Number
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true, // Prevent duplicate roll numbers
      trim: true,
    },

    // Student Email
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Email must be unique
      lowercase: true, // Automatically converts to lowercase
      trim: true,
    },

    // Student Department
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },

    // Current Semester
    semester: {
      type: Number,
      required: [true, "Semester is required"],

      // Minimum semester allowed
      min: 1,

      // Maximum semester allowed
      max: 8,
    },

    // Student CGPA
    cgpa: {
      type: Number,
      required: [true, "CGPA is required"],

      // CGPA cannot be below 0
      min: 0,

      // CGPA cannot be greater than 4
      max: 4,
    },

    // Student Age
    age: {
      type: Number,
      required: [true, "Age is required"],

      // Minimum age allowed
      min: 15,
    },

    // Phone Number
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    // City Name
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    // Graduation Status
    // Default value is false if not provided
    isGraduated: {
      type: Boolean,
      default: false,
    },
  },

  // ===================================
  // Schema Options
  // ===================================

  {
    // Automatically creates:
    // createdAt
    // updatedAt
    timestamps: true,
  }
);

// ===================================
// Export Model
// ===================================

// Create a MongoDB collection named "students"
// and export the model so it can be used
// in controllers.
module.exports = mongoose.model("Student", studentSchema);