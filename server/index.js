require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 8080;
const db = require("./models");
app.use(express.json());
app.use(cors());
