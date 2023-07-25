const express = require("express");
const router = express.Router();
const { signup, signin, resetPassword } = require("../handlers/auth");

// prefix: "/api/auth"
router.post("/signup", signup);
router.post("/signin", signin);
router.put("/passwordupdate", resetPassword);

module.exports = router;
