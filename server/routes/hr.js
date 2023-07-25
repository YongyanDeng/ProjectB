const express = require("express");
const router = express.Router({ mergeParams: true });
const { getAllApplications, getEmployeeApplicaton, reviewApplication } = require("../handlers/hr");

// prefix: "/api/hr/:id"
router.get("/", getAllApplications);
router.get("/:employeeId", getEmployeeApplicaton);
router.put("/:employeeId", reviewApplication);

module.exports = router;
