const db = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const visaProcess = ["OPT Receipt", "OPT EAD", "I-983", "I-20"];

/**
 * Get all applications besides himself/herself as list
 * @param {*} req
 * @param {[brief info of each application]} res
 * @param {*} next
 * @returns
 */
exports.getAllApplications = async function (req, res, next) {
    try {
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
exports.getAnApplicaton = async function (req, res, next) {
    try {
        const employee = await db.Employee.findById(req.params.employeeId);
        if (!employee) return res.status(401).json({ error: "Employee not found" });

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
            feedback,
        } = employee;

        // Output
        const current_document = await db.Document.findById(documents[documents.length - 1]);

        return res.status(200).json({
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
            // if documents is empty, current_document return null
            current_document,
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
 * HR provide review & feedback of rejection in onboarding application
 * @param {params: {id, employeeId}, body: {review, feedback}} req
 * @param {application detail} res
 * @param {*} next
 * @returns
 */
exports.reviewApplication = async function (req, res, next) {
    try {
        const employee = await db.Employee.findById(req.params.employeeId);
        if (!employee) return res.status(401).json({ error: "Employee not found" });

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
        } = employee;
        return res.status(200).json({
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
            document_status: !!documents.length ? "No file uploaded yet" : "Pending",
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
 * Get all employees' visa status and make it as a list
 * @param {params: {id}} req
 * @param {inProgess: [], all: []} res
 * @param {*} next
 */
exports.getVisaList = async function (req, res, next) {
    try {
        const employees = await db.Employee.find();

        const inProgress = [];
        for (const employee of employees) {
            const { documents } = employee;
            if (documents.length < 4) inProgress.push(employee);
            else {
                const lastDoc = await db.Document.findById(documents[documents.length - 1]);
                if (lastDoc.document_status !== "approved") inProgress.push(employee);
            }
        }

        // Output
        return res.status(200).json({
            inProgress,
            all: employees,
        });
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};

/**
 * Get a employee's visa detail
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.getOneVisa = async function (req, res, next) {
    try {
        const employee = await db.Employee.findById(req.params.employeeId);
        if (!employee) return res.status(401).json({ error: "Employee not found" });

        const { id, email, name, role, work_authorization, documents } = employee;

        // const lastDoc = await db.Document.findById(documents[documents.length - 1]);
        // if (!lastDoc && documents.length === 0) {
        //     console.log(`${name.first_name} ${name.last_name} hasn't upload any visa file yet!`);
        // } else if (lastDoc.document_status !== "pending" && documents.length < 4) {
        //     console.log(
        //         `${name.first_name} ${name.last_name} hasn't process to next step: ${
        //             visaProcess[document.length]
        //         }!`
        //     );
        // } else if (document.length === 4) {
        //     console.log("This employee has completed all processes");
        // }

        let end = work_authorization.end_date.getTime();
        let start = work_authorization.start_date.getTime();
        const remaining_days = (end - start) / (1000 * 3600 * 24);
        const extendedWorkAuth = {
            ...work_authorization,
            remaining_days,
        };

        return res.status(200).json({
            id,
            email,
            name,
            role,
            work_authorization: extendedWorkAuth,
            documents,
        });
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};

exports.reviewOneVisa = async function (req, res, next) {
    try {
        const employee = await db.Employee.findById(req.params.employeeId);
        if (!employee) return res.status(401).json({ error: "Employee not found" });

        const { id, email, name, role, work_authorization, documents } = employee;

        const lastDoc = await db.Document.findById(documents[documents.length - 1]);
        if (!lastDoc && documents.length === 0) {
            console.log(`${name.first_name} ${name.last_name} hasn't upload any visa file yet!`);
        } else if (lastDoc.document_status !== "pending" && documents.length < 4) {
            console.log(
                `${name.first_name} ${name.last_name} hasn't process to next step: ${
                    visaProcess[document.length]
                }!`
            );
        } else if (document.length === 4) {
            console.log("This employee has completed all processes");
        }

        // Update document's status
        lastDoc.document_status = req.body.review;
        await lastDoc.save();

        return res.status(200).json({
            id,
            email,
            name,
            role,
            work_authorization,
            documents,
            current_document: lastDoc,
        });
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};
