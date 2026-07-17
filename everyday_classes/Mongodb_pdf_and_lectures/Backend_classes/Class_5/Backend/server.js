// firstly install these commands
// npm install express
// npm install mongoose
// npm install dotenv
//npm install -g nodemon => Agar globally install karte hain to har project mein use kar sakte hain.
//npm install cors = cors ka full form Cross-Origin Resource Sharing hai. Ye package tab install kiya jata hai jab Frontend aur Backend alag-alag origins (URL/Port) par run kar rahe hon aur browser security ki wajah se request block ho rahi ho



const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware

app.use(cors());
app.use(express.json());
// ======================

// MongoDB Connection
// ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("Database Connection Error:", err.message);
  });

// ======================
// Register API
// ======================
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check Duplicate Email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Create User
    const newUser = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "Registration Successful",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// Login API
// ======================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    // Find User
    const user = await User.findOne({
      email,
      password,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

    res.status(200).json({
      message: "Login Successful",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// Get All Users
// ======================
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// Get Single User
// ======================
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// ======================
// Update User
// ======================
app.put("/users/:id", async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // Check if user exists
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check duplicate email
        if (email) {
            const existingUser = await User.findOne({
                email,
                _id: { $ne: req.params.id }
            });

            if (existingUser) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }
        }

        // Object for updating fields
        const updateData = {};

        if (name) {
            updateData.name = name;
        }

        if (email) {
            updateData.email = email;
        }

        if (password) {
            updateData.password = password;
        }

        // Check if no data is provided
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "Please provide at least one field to update"
            });
        }

        // Update User
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

// ======================
// Delete User
// ======================
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

console.log(process.env.MONGO_URI);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});