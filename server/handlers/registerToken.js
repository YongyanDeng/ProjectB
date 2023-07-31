const db = require("../models");
const bcrypt = require("bcrypt");

// Generate a random token with bcrypt, then upload to db

exports.uploadRegisterToken = async function (req, res, next) {
    try {
        const { email, hashToken } = req.body;
        // Set expiration as 3 hours later
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 1);

        // Upload to db
        const createdToken = await db.RegisterToken.create({
            email,
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
        const decodedToken = decodeURIComponent(req.params.hashToken);
        const foundToken = await db.RegisterToken.findOne({ token: decodedToken });
        if (!foundToken) return res.status(401).json({ error: { message: "Token not exist" } });

        // Check token's status
        if (foundToken.status === "pending") {
            foundToken.status = "activated";
            await foundToken.save();
        } else {
            return res
                .status(401)
                .json({ error: { message: `Your register token is ${foundToken.status}!` } });
        }

        return res.status(200).json({
            foundToken,
        });
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};

exports.getAllToken = async function (req, res, next) {
    try {
        const tokens = await db.RegisterToken.find();
        return res.status(200).json(tokens);
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};
