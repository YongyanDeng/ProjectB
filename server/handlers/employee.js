const db = require("../models");
const express = require("express");
// const multer = require("multer");

const app = express();

// Route to handle document uploads

const getAllEmployee = async (req, res, next) => {
    try {
        const employees = await db.Product.find().select("-password");
        return res.status(200).json(employees);
    } catch (error) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};

const updateEmployee = async function (req, res, next) {
    try {
        const employeeId = req.params.id;
        const updates = req.body;

        // Find the employee by ID
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        Object.assign(employee, updates);
        const updatedEmployee = await employee.save();

        return res.status(201).json(updatedEmployee);
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
        const employee = await db.Employee.findById(employeeId).select(
            "-password"
        );
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        return res.status(200).json(employee);
    } catch (error) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};

// Route to handle document uploads
const uploadDocument = async (req, res, next) => {
    try {
        const employeeId = req.params.id;
        const { document_type, file_name, file_url } = req.body;

        // Find the employee by ID
        const employee = await db.Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Add the new document to the employee's documents array
        employee.documents.push({
            document_type,
            file_name,
            file_url,
        });

        // Save the updated employee document
        const updatedEmployee = await employee.save();

        return updatedEmployee;
    } catch (error) {
        return next({
            status: 500,
            message: "Error uploading document",
        });
    }
};
const deleteDocument = async (req, res, next) => {
    try {
        const employeeId = req.params.employeeId;
        const documentId = req.params.documentId;
        const employee = await db.Employee.findById(employeeId);
        if (!employee) {
            return res.status(401).json({ error: "User do not exist" });
        }
        const document = employee.documents.id(documentId);
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }

        // Remove the document from the employee's documents array
        document.remove();

        // Save the updated employee data
        const updatedEmployee = await employee.save();
        return res.json(updatedEmployee);
    } catch (err) {
        return next({
            status: 500,
            message: "Error delete document",
        });
    }
};

module.exports = {
    getAllEmployee,
    updateEmployee,
    getEmployee,
    uploadDocument,
    deleteDocument,
};
