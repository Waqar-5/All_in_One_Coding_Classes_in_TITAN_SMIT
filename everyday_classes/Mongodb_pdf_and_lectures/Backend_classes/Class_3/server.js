const express = require("express");
const app = express();
const PORT = 3000;
// Middleware
app.use(express.json());
// Temporary array to store users
const users = [];
// =====================
// POST - Register User
// =====================
app.post("/register", (req, res) => {
const { name, email, password } = req.body;
// Validation
if (!name || !email || !password) {
return res.status(400).json({
message: "All fields are required"
});
}
// Duplicate Email Check
const existingUser = users.find(user => user.email === email);
if (existingUser) {
return res.status(400).json({
message: "Email already exists"
});
}
// Create User
const newUser = {
id: users.length + 1,
name,
email,
password
};
users.push(newUser);
res.status(201).json({
message: "Registration Successful",
user: newUser
});
});

//Get api 
app.get("/users",(req,res)=>{
    res.json(users)
})

// update api
app.put("/users/:id",(req,res)=>{
    const id= Number(req.params.id)
    const {name , email, password} =req.body;
    const user= users.find(u =>  u.id ===id)
    if (!user) {
return res.status(404).json({
message: "User not found"
});
}
if (name) { user.name = name; }
if (email) { user.email = email; }
if (password) { user.password = password; }
res.json({
message: "User updated successfully",
user
});
});
// delete api

// =====================
// DELETE - Delete User
// =====================
app.delete("/users/:id", (req, res) => {
const id = Number(req.params.id);
const index = users.findIndex(u => u.id === id);
if (index === -1) {
return res.status(404).json({
message: "User not found"
});
}
users.splice(index, 1);
res.json({
message: "User deleted successfully"
});
});


app.listen(PORT, () => {
console.log(`Server Running On Port ${PORT}`);
});