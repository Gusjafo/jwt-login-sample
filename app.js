require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importing user context
const User = require("./model/user");

// Autorithation route
const auth = require("./middleware/auth");

app.use("/static", express.static('./static/'));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/static/login.html");
});

app.get("/register", function (req, res) {
    res.sendFile(__dirname + "/static/signup.html");
});

// Register
app.post("/register", async (req, res) => {

    try {
        const { name, email, pass } = req.body;
        console.log("body: " + name + email);
        if (!(email && pass && name)) {
            res.status(400).send("All input is required");
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User already exist. Please login");
        }

        encryptedPassword = await bcrypt.hash(pass, 10);

        const user = await User.create({
            first_name: name,            
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        //create token
        const token = jwt.sign(
            { user_id: user._id, user: name, email: email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        //save user token
        user.token = token;

        //return new user
        // res.status(201).json(token);
        res
        .status(200)
        .cookie('token', token)
        .redirect('/welcome');

    } catch (err) {
        console.log(err);
    }
});

// Login
app.post("/login", async (req, res) => {
    // console.log("body", req.body);

    try {
        const { email, pass} = req.body;

        //validate user input
        if (!(email && pass)) {
            res.status(400).send("All input is required");
            return;
        }

        //validate if user exist in our database
        const user = await User.findOne({ email });


        if (user && (await bcrypt.compare(pass, user.password))) {
            // console.log(user);
            //create token
            const token = jwt.sign(
                { user_id: user._id, user: user.first_name, email: email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            //save user token
            user.token = token;
            


            //to user
            // res.status(200).json(user);
            res
                .status(200)
                .cookie('token', token)
                .redirect('/welcome');
            
        } else {
            res.status(400).send("Invalid credentials");
        }

    } catch (err) {
        console.log(err);
    }

});

app.get("/welcome", auth, (req, res) => {
    console.log(req.res.user);
    res.set('Content-Type', 'text/html')
    res.status(200).send("<center><h1>Welcome 👁</h1></center>");
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
