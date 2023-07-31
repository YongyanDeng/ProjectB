const mongoose = require("mongoose");

const registerTokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "pending",
    },
});

const RegisterToken = mongoose.model("RegisterToken", registerTokenSchema);
module.exports = RegisterToken;
