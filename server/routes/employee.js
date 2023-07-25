const express = require("express");
const router = express.Router({ mergeParams: true });
const { uploadApplication } = require("../handlers/employee");

// prefix: "/api/employee/:id"
router.put("/", uploadApplication);

module.exports = router;
