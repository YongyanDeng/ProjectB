const db = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Sign In
 * @param {body: {email, password}} req
 * @param {id, username, role, ducoments, document_status, document_needed: document_steps[current_document_step], token} res
 * @param {middleware()} next
 * @returns
 */
exports.signin = async function (req, res, next) {
    try {
        const employee = await db.Employee.findOne({
            email: req.body.email,
        });

        const { id, username, role, name, ducoments, feedback } = employee;

        const isMatch = await employee.comparePassword(req.body.password, next);
        if (isMatch) {
            const token = jwt.sign(
                {
                    id,
                    username,
                    role,
                },
                process.env.JWT_SECRET_KEY
            );

            return res.status(200).json({
                id,
                username,
                role,
                name,
                ducoments,
                token,
                feedback,
            });
        } else {
            return next({
                status: 400,
                message: "Invalid Password!",
            });
        }
    } catch (err) {
        return next({
            status: 400,
            message: "Email not found!",
        });
    }
};

/**
 * Signup process.
 * @param {body: {email, password, username}} req
 * @param {id, username, role, documents, token} res
 * @param {middleware()} next
 * @returns
 */
exports.signup = async function (req, res, next) {
    try {
        const { hashToken } = req.body;
        const decodedToken = decodeURIComponent(hashToken);
        const foundToken = await db.RegisterToken.findOne({ token: decodedToken });
        if (!foundToken) return res.status(401).json({ error: { message: "Token not exist" } });

        // Check token's status
        if (foundToken.status !== "pending") {
            return res
                .status(401)
                .json({ error: { message: `Your register token is ${foundToken.status}!` } });
        }

        const employee = await db.Employee.create(req.body);
        const { id, username, role, documents } = employee;
        const token = await jwt.sign(
            {
                id,
                username,
                role,
            },
            process.env.JWT_SECRET_KEY
        );

        foundToken.status = "activated";
        await foundToken.save();

        return res.status(200).json({
            id,
            username,
            role,
            documents,
            token,
        });
    } catch (err) {
        if (err.code === 11000) err.message = "Sorry, this email / username is taken!";
        return next({
            status: 400,
            message: err.message,
        });
    }
};

/**
 * Update employee's pasword
 * @param {body: {email, password}} req
 * @param {message} res
 * @param {middleware()} next
 * @returns
 */
exports.resetPassword = async function (req, res, next) {
    try {
        const employee = await db.Employee.findOne({
            email: req.body.email,
        });
        if (!employee) {
            return next({
                status: 400,
                message: "Email not found!",
            });
        }
        employee.password = req.body.password;
        await employee.save();
        res.status(202).json({
            message: `${employee.username} password updated!`,
        });
    } catch (err) {
        return next({
            status: 400,
            message: "Email not found!",
        });
    }
};
