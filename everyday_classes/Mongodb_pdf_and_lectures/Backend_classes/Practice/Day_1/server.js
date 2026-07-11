const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

const users = [];

app.post("/register", (req, res) => {

    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Check existing email
    const existUser = users.find(user => user.email === email);

    if (existUser) {
        return res.status(400).json({
            message: "Email already exists"
        });
    }

    // Create new user
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password
    };

    users.push(newUser);

    res.status(201).json({
        message: "Registration Successfully",
        user: newUser
    });

});

app.get("/users", (req, res) => {
    res.json(users);
});


app.delete("/users/:id", (req, res) => {
     // Get ID from URL
    const id = Number(req.params.id);
    // Find the user's index
    const userIndex = users.findIndex(user => user.id === id);

    // check if user exists
    if(userIndex === -1){
        return res.status(404).json({
            message:"User not found"
        });
    }

    const deletedUser = users.splice(userIndex, 1)

    // send response
    res.status(200).json({
        message: "User deleted successfully",
        user:deletedUser[0]
    })

})


app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});