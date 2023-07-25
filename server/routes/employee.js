const express = require("express");
const {
    getAllEmployee,
    updateEmployee,
    getEmployee,
    uploadDocument,
    deleteDocument,
} = require("../handlers/employee");
const router = express.Router({ mergeParams: true });
const { loginVerify, userVerify, vendorVerify } = require("../middleware/auth");

//  prefix: /api/employees/:id"
router.get("/", getEmployee);
router.put("/", updateEmployee);

router.post("/documents", uploadDocument);
router.delete("/documents/:documentId", deleteDocument);

module.exports = router;
