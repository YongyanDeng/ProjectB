const mongoose = require("mongoose");

const registerTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});
// Setup TTL
registerTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RegisterToken = mongoose.model("RegisterToken", registerTokenSchema);
module.exports = RegisterToken;
