const express = require("express");
const router = express.Router({ mergeParams: true });
const {
    getAllProfiles,
    getAllApplications,
    getAnApplicaton,
    reviewApplication,
    getVisaList,
    getOneVisa,
    reviewOneVisa,
} = require("../handlers/hr");
const { getAllToken } = require("../handlers/registerToken");

// prefix: "/api/hr/:id"
// Employee Profiles
router.get("/profiles", getAllProfiles);

// Hiring Management
router.get("/emailHistory", getAllToken);
router.get("/applications", getAllApplications);
router.get("/applications/:employeeId", getAnApplicaton);
router.put("/applications/:employeeId", reviewApplication);

// Visa Management
router.get("/visa", getVisaList);
router.get("/visa/:employeeId", getOneVisa);
router.put("/visa/:employeeId", reviewOneVisa);

module.exports = router;
