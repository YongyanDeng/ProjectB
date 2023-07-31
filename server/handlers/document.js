const db = require("../models");
const express = require("express");
const fs = require("fs");
const app = express();

// Get all documents of one employee
const getAllDocuments = async (req, res, next) => {
    try {
        const employeeId = req.params.id;

        // Find the employee by their ID
        const employee = await db.Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Find all documents designed by the employee
        const documents = await db.Document.find({ employee: employeeId });

        return res.status(200).json(documents);
    } catch (err) {
        console.error("Error retrieving documents:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

const getDocument = async (req, res, next) => {
    try {
        const employeeId = req.params.id;

        // Find the employee by their ID
        const employee = await db.Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Find specific document
        const document = await db.Document.findById(req.params.documentId);

        // check if the document was uploaded by the employee
        if (document.employee.toString() !== employeeId) {
            return res.status(401).json({ error: "Unauthorized to get this document" });
        }

        res.setHeader("Content-Disposition", `attachment; filename="${document.document_name}"`);
        res.setHeader("Content-Type", "application/pdf");

        res.send(document.content);
    } catch (err) {
        console.error("Error retrieving document:", err);
        res.status(500).json({ error: "Failed to download PDF" });
    }
};

const uploadDocument = async (req, res, next) => {
    try {
        const employeeId = req.params.id;
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const pdfFile = req.files.pdf;

        // Assuming you have a directory named 'uploads' to store the PDF files
        const uploadPath = "./documents/" + pdfFile.name;

        // Use the mv() method to place the PDF file on the server
        await pdfFile.mv(uploadPath);

        // Create a new document object
        const newDocument = new db.Document({
            document_type: req.body.document_type, // Set the document type as 'PDF'
            document_name: pdfFile.name,
            contentType: pdfFile.mimetype,
            content: fs.readFileSync(uploadPath), // Read the PDF file content
            document_status: "pending",
            employee: employeeId,
        });

        const employee = await db.Employee.findById(employeeId);
        if (!employee) {
            return res.status(401).json({ error: "employee do not exist" });
        }
        employee.documents.push(newDocument.id);
        await employee.save();

        // Save the document to the database
        await newDocument.save();

        return res.status(201).json(newDocument);
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};
const deleteDocument = async (req, res, next) => {
    try {
        const documentId = req.params.documentId;

        // Check if the document exists in the collection
        const deletedDocument = await db.Document.findById(documentId);
        if (!deletedDocument) {
            return res.status(404).json({ error: "Document not found" });
        }
        // verify if this document belongs to employee who wants to delete this doc
        if (deletedDocument.employee.toString() !== req.params.id) {
            return res.status(401).json({ error: "Unauthorized to delete this document" });
        }
        // // Remove the document from the collection
        // await db.Document.findByIdAndRemove(documentId);
        await deletedDocument.deleteOne();
        res.status(201).json({ message: "Document is deleted successfully" });
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};
module.exports = {
    getAllDocuments,
    getDocument,
    uploadDocument,
    deleteDocument,
};
