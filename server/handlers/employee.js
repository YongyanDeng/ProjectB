const db = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Upload a single employee's application data
 * @param {body: {input field data}} req
 * @param {updated application data} res
 * @param {} next
 * @returns
 */
exports.uploadApplication = async function (req, res, next) {
    try {
        const employee = await db.Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!employee) {
            return res.status(401).json({ error: "Employee not found" });
        }

        return res.json(employee);
    } catch (err) {
        if (err.code === 11000) err.message = "Sorry, this name/email is taken!";
        return next({
            status: 500,
            message: err.message,
        });
    }
};
