const express = require("express");
const router = express.Router({ mergeParams: true });
const {
    getAllApplications,
    getAnApplicaton,
    reviewApplication,
    getVisaList,
    getOneVisa,
    reviewOneVisa,
} = require("../handlers/hr");

// prefix: "/api/hr/:id"
// Hiring Management
router.get("/applications", getAllApplications);
router.get("/applications/:employeeId", getAnApplicaton);
router.put("/applications/:employeeId", reviewApplication);
// Visa Management
router.get("/visa", getVisaList);
router.get("/visa/:employeeId", getOneVisa);
router.put("/visa/:employeeId", reviewOneVisa);

module.exports = router;
