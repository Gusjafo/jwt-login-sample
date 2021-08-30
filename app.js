require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

// Importing user context
const User = require("./model/user");

// Autorithation route
const auth = require("./middleware/auth");

app.use('./static', express.static('public'));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

// Register
app.post("/register", async (req, res) => {

    try {
        const { first_name, last_name, email, password } = req.body;

        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User already exist. Please login");
        }

        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        //create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        //save user token
        user.token = token;

        //return new user

        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
});

// Login
app.post("/login", async (req, res) => {
    console.log("body", req.body);

    try {
        const { email, password } = req.body;

        //validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
            return;
        }

        //validate if user exist in our database
        const user = await User.findOne({ email });
        

        if (user && (await bcrypt.compare(password, user.password))) {
            console.log(user);
            //create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            //save user token
            user.token = token;

            //to user
            res.status(200).json(user);
        } else {
            res.status(400).send("Invalid credentials");
        }
        
    } catch (err) {
        console.log(err);
    }

});

app.get("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 👁");
});

// This should be the last route else any after it won't work
app.use("*", (req, res) => {
    res.status(404).json({
      success: "false",
      message: "Page not found",
      error: {
        statusCode: 404,
        message: "You reached a route that is not defined on this server",
      },
    });
  });

module.exports = app;