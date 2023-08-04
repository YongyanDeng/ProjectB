const db = require("../models");
const express = require("express");
// const multer = require("multer");

const app = express();

// Route to handle document uploads
const updateEmployee = async function (req, res, next) {
    try {
        const employeeId = req.params.id;
        const updates = req.body;

        // Find the employee by ID
        const employee = await db.Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        Object.assign(employee, updates);
        await employee.save();

        const {
            id,
            email,
            username,
            name,
            profile_picture,
            role,
            address,
            contact_info,
            identification_info,
            work_authorization,
            reference,
            onboarding_status,
            documents,
            feedback,
            usCitizen,
        } = employee;

        const docs = [];
        for (const documentId of documents) {
            const document = await db.Document.findById(documentId);
            if (document) docs.push(document);
        }

        return res.status(201).json({
            id,
            email,
            username,
            name,
            profile_picture,
            role,
            address,
            contact_info,
            identification_info,
            work_authorization,
            reference,
            onboarding_status,
            documents: docs,
            feedback,
            usCitizen,
        });
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};

const getEmployee = async (req, res, next) => {
    try {
        const employeeId = req.params.id;

        // Find the employee by ID
        const employee = await db.Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        const {
            id,
            email,
            username,
            name,
            profile_picture,
            role,
            address,
            contact_info,
            identification_info,
            work_authorization,
            reference,
            onboarding_status,
            documents,
            feedback,
            usCitizen,
        } = employee;

        const docs = [];
        for (const documentId of documents) {
            const document = await db.Document.findById(documentId);
            if (document) docs.push(document);
        }

        return res.status(200).json({
            id,
            email,
            username,
            name,
            profile_picture,
            role,
            address,
            contact_info,
            identification_info,
            work_authorization,
            reference,
            onboarding_status,
            documents: docs,
            feedback,
            usCitizen,
        });
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};

module.exports = {
    updateEmployee,
    getEmployee,
};
