const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

exports.connect = () => {
    // Connecting to the database
    mongoose
    .connect(MONGO_URI, {
    })
    .then(() => {
        console.log("Successfuly conected to MongoDB");
    })
    .catch((error) => {
        console.log("Database conection failed. Exiting now...");
        console.error(error);
        process.exit(1);
    });
};