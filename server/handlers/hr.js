const db = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Get all applications besides himself/herself as list
 * @param {*} req
 * @param {[brief info of each applications]} res
 * @param {*} next
 * @returns
 */
exports.getAllApplications = async function (req, res, next) {
    try {
        console.log(req.params.id);
        const employees = await db.Employee.find();

        const output = employees?.reduce((acc, employee) => {
            const { id, email, name, role, onboarding_status } = employee;

            // Skip self application
            if (id === req.params.id) return acc;

            acc.push({
                id,
                email,
                name,
                role,
                onboarding_status,
            });
            return acc;
        }, []);
        return res.status(200).json(output);
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};

/**
 * Get a single employee's application data
 * @param {params: {id}} req
 * @param {application detail} res
 * @param {*} next
 */
exports.getEmployeeApplicaton = async function (req, res, next) {
    try {
        const employee = await db.Employee.findById(req.params.employeeId);
        if (!employee) {
            return res.status(401).json({ error: "Employee not found" });
        }

        const {
            id,
            username,
            name,
            role,
            address,
            profile_picture,
            contact_Info,
            identification_info,
            work_authorization,
            reference,
            onboarding_status,
            documents,
            // document_status,
            // document_steps,
            current_document_step,
            feedback,
        } = employee;

        return res.status(200).json({
            id,
            username,
            name: name ? `${name.first_name} ${name.last_name}` : ``,
            role,
            address,
            profile_picture,
            contact_Info,
            identification_info,
            work_authorization,
            reference,
            onboarding_status,
            document: documents[current_document_step],
            document_status: document ? "No file uploaded" : "Pending",
            feedback,
        });
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};

/**
 * HR provide review & feedback of rejection
 * @param {params: {id, employeeId}, body: {review, feedback}} req
 * @param {application detail} res
 * @param {*} next
 * @returns
 */
exports.reviewApplication = async function (req, res, next) {
    try {
        const employee = await db.Employee.findById(req.params.employeeId);
        if (!employee) {
            return res.status(401).json({ error: "Employee not found" });
        }

        const { review, feedback } = req.body;
        employee.onboarding_status = review;
        if (review === "Rejected" && feedback) employee.feedback = feedback;

        await employee.save();

        // Output
        const {
            id,
            username,
            name,
            role,
            address,
            profile_picture,
            contact_Info,
            identification_info,
            work_authorization,
            reference,
            onboarding_status,
            documents,
            document_status,
            document_steps,
            current_document_step,
        } = employee;
        return res.status(200).json({
            id,
            username,
            name: name ? `${name.first_name} ${name.last_name}` : ``,
            role,
            address,
            profile_picture,
            contact_Info,
            identification_info,
            work_authorization,
            reference,
            onboarding_status,
            document: documents[current_document_step],
            document_status: document ? "No file uploaded" : "Pending",
            feedback,
        });
    } catch (err) {}
};
