const express = require("express");
const router = express.Router();

const { loginVerify, userVerify, hrVerify } = require("../middleware/auth");
const { signup, signin, resetPassword } = require("../handlers/auth");
const { uploadRegisterToken, registerTokenCheck } = require("../handlers/registerToken");

// prefix: "/api/auth"
router.post("/register/:id", loginVerify, userVerify, hrVerify, uploadRegisterToken);
router.get("/register/:hashToken", registerTokenCheck);

router.post("/signup", signup);
router.post("/signin", signin);
router.put("/passwordupdate", resetPassword);

module.exports = router;
