
const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json())

const users = [];

// /body raw json
// authentication and validaion ??

app.post("/register", (req, res)=> {
    const {name, email, password} = req.body;

    //400 is sued for warning
    // 200 is used created successfully
    // validation
    if(!name || !email || !password){
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    // Duplicate check email

    const existingUser = users.find(user => user.email === email);

    if(existingUser){
        return res.status(400).json({
            message: "Email already exists"
        });
    }

    // create object
    const newUser = {

        // A unique id for every user
        id: users.length + 1,

        name,
        email,
        password

    };

    // save user in array
    users.push(newUser)

    // sucess response shows to user or client
    res.status(201).json({
        message: "Registeration sucessful",
        user: newUser
    })
})

app.get("/users", (req, res)=> {
    res.json(users)
})


app.listen(PORT, ()=>{
    console.log(`Server is running on the port ${PORT}`)
})




// // Start the server and store it in a variable
// const server = app.listen(PORT, () => {

//     // This runs only if the server starts successfully.
//     console.log(`✅ Server is running on port ${PORT}`);

// });

// // Listen for server startup errors
// server.on("error", (err) => {

//     // Print the error message in the terminal
//     console.error("❌ Server failed to start.");

//     // Show the actual error
//     console.error(err.message);

// });


// app.get("/users", (req, res) => {

//     const serverHealthy = false; // Example condition

//     if (!serverHealthy) {
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });
//     }

//     res.status(200).json(users);
// });

// app.listen(PORT, ()=>{
//     console.log(`Server is running on the port ${PORT}`)
// })
