// Install JWT first:
// npm install jsonwebtoken
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// ================= REGISTER =================
router.post("/register", async (req, res) => {
try {
const { name, email, password } = req.body;
// Check whether user already exists
const exist = await User.findOne({ email });
if (exist) {
return res.status(400).json({
message: "User already exists",
});
}
// Hash password before saving it in MongoDB
// 10 = Salt Rounds
const hash = await bcrypt.hash(password, 10);
// Create new user
const user = new User({
name,
email,
password: hash,
});
// Save user in MongoDB
await user.save();
res.status(201).json({
message: "Registration Successful",
});
} catch (err) {
res.status(500).json({
message: "Server Error",

});
}
});
// ================= LOGIN =================
router.post("/login", async (req, res) => {
try {
const { email, password } = req.body;
// 1. Find user by email
const user = await User.findOne({ email });
if (!user) {
return res.status(404).json({
message: "User not found",
});
}
// 2. Compare entered password
// with hashed password stored in MongoDB
const isMatch = await bcrypt.compare(
password,
user.password
);
if (!isMatch) {
return res.status(401).json({
message: "Invalid email or password",
});
}
// =================================================
// 3. LOGIN SUCCESSFUL
// =================================================
// ================= JWT TOKEN =================
// JWT payload
const payload = {
userId: user._id,
email: user.email,
};

// =================================================
// OPTION 1: LIMITED JWT TOKEN
// =================================================
// Token will expire after 1 hour.
// This is recommended for better security.
const token = jwt.sign(
payload,
process.env.JWT_SECRET,
{
expiresIn: "1h",
}
);
// =================================================
// OPTION 2: UNLIMITED JWT TOKEN
// =================================================
// If you want an unlimited/non-expiring token,
// remove the expiresIn option.
//
// const token = jwt.sign(
// payload,
// process.env.JWT_SECRET
// );
//
// WARNING:
// Unlimited tokens are generally NOT recommended
// for real-world applications because if a token
// is stolen, it may remain valid indefinitely.
// ================= RESPONSE =================
res.status(200).json({
message: "Login Successful",
// Send JWT token to frontend/Postman
token: token,
// Send user information
user: {
id: user._id,
name: user.name,
email: user.email,
},
});
} catch (err) {
res.status(500).json({
message: "Server Error",
});
}
});
module.exports = router;