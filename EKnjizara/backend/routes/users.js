require("dotenv");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { UserModel } = require("../models/usersModel");

router.get("/", async(req, res) => {});

module.exports = router;
