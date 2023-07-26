require("dotenv").config()
const mongoose = require("mongoose");

function createConnection() {

    const uri = process.env.DB_URL
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    mongoose.connect(uri, options)
        .then(() => {
            console.log("Connected to DB");
        })
};

module.exports = createConnection;