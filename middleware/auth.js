const jwt = require("jsonwebtoken");
// const express = require("express");
// const app = express();
// app.use(express.urlencoded({ extended: true }));

const config = process.env;

const verifyToken = (req, res, next) => {
    // console.log("body: ", req);
    let token = 
    req.headers.cookie["token"] ||
    req.headers.cookie ||
    req.headers["token"];
    token = token.split("=").pop();
    // console.log("token: " + token);
    if(!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        // console.log("decoded: ", decoded);
        res.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;
