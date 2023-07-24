const mongoose = require("mongoose");
// showing additionl information about db
mongoose.set("debug", true);
require("dotenv").config();

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB", err);
    });

module.exports = mongoose;
module.exports.User = require("./user");
module.exports.Product = require("./product");
