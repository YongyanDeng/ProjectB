const db = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const visaProcess = ["OPT Receipt", "OPT EAD", "I-983", "I-20"];

/**
 * Get all employee profiles besides himself/herself as list
 * @param {*} req
 * @param {[brief info of each application]} res
 * @param {*} next
 * @returns
 */
exports.getAllProfiles = async function (req, res, next) {
    try {
        const employees = await db.Employee.find({ _id: { $ne: req.params.id } });

        const output = employees?.reduce((acc, employee) => {
            const { id, email, name, contact_info, identification_info, work_authorization } =
                employee;

            acc.push({
                id,
                email,
                name,
                contact_info,
                identification_info,
                work_authorization,
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
 * Get all applications besides himself/herself as list
 * @param {*} req
 * @param {[brief info of each application]} res
 * @param {*} next
 * @returns
 */
exports.getAllApplications = async function (req, res, next) {
    try {
        const employees = await db.Employee.find({ _id: { $ne: req.params.id } });

        const output = employees?.reduce((acc, employee) => {
            const { id, email, name, role, onboarding_status } = employee;
            acc.push({
                id,
                email,
                name,
            });
            return acc;
        }, []);

        // Output
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
            email,
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

        const docs = [];
        for (const documentId of documents) {
            const document = await db.Document.findById(documentId);
            docs.push(document);
        }

        // Corner case
        if (!work_authorization.title) {
            return res.status(200).json({
                id,
                email,
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
                documents: docs,
                feedback,
            });
        }

        // Calculate OPT's remaining days
        let end = work_authorization.end_date.getTime();
        let now = new Date().getTime();
        const remaining_days = Math.floor((end - now) / (1000 * 3600 * 24));
        const extendedWorkAuth = {
            ...work_authorization,
            remaining_days,
        };

        // Output
        return res.status(200).json({
            id,
            email,
            username,
            name,
            role,
            address,
            profile_picture,
            contact_Info,
            identification_info,
            work_authorization: extendedWorkAuth,
            reference,
            onboarding_status,
            documents: docs,
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

        // update application's onboarding_status & feedback
        const { review, feedback } = req.body;
        employee.onboarding_status = review;
        employee.feedback = feedback;

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
 * Get all employees visa data and make it as 2 lists
 * @param {params: {id}} req
 * @param {inProgess: [], all: []} res
 * @param {*} next
 */
exports.getVisaList = async function (req, res, next) {
    try {
        const employees = await db.Employee.find({ _id: { $ne: req.params.id } });

        const inProgress = [];
        const all = [];
        for (const employee of employees) {
            const { id, email, name, work_authorization, documents } = employee;
            if (documents.length < 4) inProgress.push({ id, email, name, work_authorization });
            else {
                const lastDoc = await db.Document.findById(documents[documents.length - 1]);
                if (lastDoc.document_status !== "approved")
                    inProgress.push({ id, email, name, work_authorization });
            }
            all.push({ id, email, name, work_authorization });
        }

        // Output
        return res.status(200).json({
            inProgress,
            all,
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
 * @param {params: {id, employeeId}} req
 * @param {id, email, id, email, name, role, work_authorization } res
 * @param {*} next
 * @returns
 */
exports.getOneVisa = async function (req, res, next) {
    try {
        const employee = await db.Employee.findById(req.params.employeeId);
        if (!employee) return res.status(401).json({ error: "Employee not found" });

        const { id, email, name, role, work_authorization, documents } = employee;

        const docs = [];
        for (const documentId of documents) {
            const document = await db.Document.findById(documentId);
            docs.push(document);
        }

        // Corner case
        if (!work_authorization.title) {
            return res.status(200).json({
                id,
                email,
                name,
                role,
                work_authorization,
                documents: docs,
            });
        }

        // Calculate OPT's remaining days
        let end = work_authorization.end_date.getTime();
        let now = new Date().getTime();
        const remaining_days = Math.floor((end - now) / (1000 * 3600 * 24));
        const extendedWorkAuth = {
            ...work_authorization,
            remaining_days,
        };

        // Output
        return res.status(200).json({
            id,
            email,
            name,
            role,
            work_authorization: extendedWorkAuth,
            documents: docs,
        });
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};

/**
 * Select a document and add review
 * @param {params: {id, employeeId}, body: {review, feedback}} req
 * @param {id, email, name, role, work_authorization, documents} res
 * @param {*} next
 * @returns
 */
exports.reviewOneVisa = async function (req, res, next) {
    try {
        const employee = await db.Employee.findById(req.params.employeeId);
        if (!employee) return res.status(401).json({ error: "Employee not found" });

        const { id, email, name, role, work_authorization, documents } = employee;

        // Update newest document's status & feedback;
        const lastDoc = await db.Document.findById(documents[documents.length - 1]);
        lastDoc.document_status = req.body.review;
        lastDoc.feedback = req.body.feedback;
        await lastDoc.save();

        const docs = [];
        for (const documentId of documents) {
            const document = await db.Document.findById(documentId);
            docs.push(document);
        }

        // Corner case
        if (!work_authorization.title) {
            return res.status(200).json({
                id,
                email,
                name,
                role,
                work_authorization,
                documents: docs,
            });
        }

        // Calculate OPT's remaining days
        let end = work_authorization.end_date.getTime();
        let now = new Date().getTime();
        const remaining_days = Math.floor((end - now) / (1000 * 3600 * 24));
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
            documents: docs,
        });
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};
