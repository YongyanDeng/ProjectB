const db = require("../models");
const bcrypt = require("bcrypt");

// Generate a random token with bcrypt, then upload to db
exports.uploadRegisterToken = async function (req, res, next) {
    try {
        const { hashToken } = req.body;
        // Set expiration as 3 hours later
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 2);

        // Upload to db
        const createdToken = await db.RegisterToken.create({
            token: hashToken,
            expiresAt: expirationTime,
        });

        // Output
        return res.status(200).json({
            createdToken,
        });
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};

exports.registerTokenCheck = async function (req, res, next) {
    try {
        const foundToken = await db.RegisterToken.findOne({ token: req.params.hashToken });

        if (!foundToken) return res.status(401).json({ error: "Registration token expired" });

        // redirect to signup process
        return res.status(200).json({
            foundToken,
        });
    } catch (err) {
        return next(err);
    }
};
