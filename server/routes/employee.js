const express = require("express");
const {
    getAllEmployee,
    updateEmployee,
    getEmployee,
} = require("../handlers/employee");
const {
    getAllDocuments,
    getDocument,
    uploadDocument,
    deleteDocument,
} = require("../handlers/document");
const router = express.Router({ mergeParams: true });
const { loginVerify, userVerify, vendorVerify } = require("../middleware/auth");

//  prefix: /api/employees/:id"
router.get("/", getEmployee);
router.put("/", updateEmployee);

router.get("/documents", getAllDocuments);
router.post("/documents", uploadDocument);
router.get("/documents/:documentId", getDocument);
router.delete("/documents/:documentId", deleteDocument);

module.exports = router;
