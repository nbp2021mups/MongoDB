require("dotenv");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { CompanyModel } = require("../models/companiesModel");

router.get("/", async(req, res) => {});

module.exports = router;
