require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const { loginVerify, userVerify, hrVerify } = require("./middleware/auth");
const authRouter = require("./routes/auth");
const errorHandler = require("./handlers/error");
const db = require("./models");

const PORT = 8080;

app.use(express.json());
app.use(cors());

// signin/signup/update password
app.use("/api/auth", authRouter);

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
