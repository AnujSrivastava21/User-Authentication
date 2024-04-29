//Require the express
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const path = require("path");
const userModel = require('./model/user');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');

//use require module

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());



//Basic Routes

app.get("/", (req, res) => {
  console.log("You are in Home Page");
  res.render('index')
});


app.post("/create",  (req, res) => {
    
    try {
        let { username, email, password, age } = req.body;
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt, async(err,hash)=>{
                let createdUser = await userModel.create({
                    username,
                    password:hash,
                    age,
                    email
                });

                const token = jwt.sign({email},"secret");
                res.cookie("Token : " , token)
                res.send(createdUser);
            })
        })
       
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user");
    }
});


app.get('/login',(req,res)=>{
    res.render('login');
})


app.post('/login', async (req, res) => {
    try {
        // Find user by email
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.send("User not found");
        }

        // Compare passwords
        bcrypt.compare(req.body.password, user.password, async (err, result) => {
            if (err) {
                // Handle error
                console.error("Error comparing passwords:", err);
                return res.status(500).send("Something went wrong");
            }
            if (result) {
                try {
                    // Sign JWT token
                    const token = await jwt.sign({ email: req.body.email }, "secret");
                    // Set cookie
                    res.cookie("Token", token);
                    return res.send("You are logged in");
                } catch (error) {
                    console.error("Error signing JWT token:", error);
                    return res.status(500).send("Something went wrong");
                }
            } else {
                // Passwords don't match
                return res.send("Incorrect password");
            }
        });
    } catch (error) {
        // Handle any other errors
        console.error("Error during login:", error);
        res.status(500).send("Something went wrong");
    }
});
// Require port

const port = 3000;
app.listen(port, (req, res) => {
  console.log(`you are in port : ${port}`);
});
