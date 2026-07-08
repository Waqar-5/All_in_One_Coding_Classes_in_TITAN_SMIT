const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express();
app.use(bodyParser.json())
app.use(cors())

app.get("/", (req, res) => {
    // console.log("A Request ")
    res.send("I am Express Server and I am <h1>ONLINE</h1> <buuton>Play Game</button>")
})

app.post("/register", (req, res) => {
    console.log("A Request Hit On Register Route");
    console.log(req.body)
    res.json({
        success:true,
        message:"User Registered Successfully"
    })
    
})


app.listen(5000)