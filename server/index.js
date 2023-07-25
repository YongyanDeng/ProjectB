require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");
const { loginVerify, userVerify, hrVerify } = require("./middleware/auth");
const authRouter = require("./routes/auth");
const employeeRouter = require("./routes/employee");
const hrRouter = require("./routes/hr");
const errorHandler = require("./handlers/error");
const db = require("./models");

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

// signin/signup/update password
app.use("/api/auth", authRouter);
app.use("/api/employee/:id", loginVerify, userVerify, employeeRouter);
app.use("/api/hr/:id", loginVerify, userVerify, hrVerify, hrRouter);

// Wrong url matching
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
