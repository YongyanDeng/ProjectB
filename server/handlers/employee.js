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
        const employee = await db.Employee.findById(employeeId);

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

module.exports = {
    getAllEmployee,
    updateEmployee,
    getEmployee,
};
