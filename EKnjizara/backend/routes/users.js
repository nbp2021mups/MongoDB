require("dotenv");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { UserModel } = require("../models/usersModel");

router.post("/register", async(req, res) => {
    try {
        new UserModel({
                ...req.body,
                lozinka: bcrypt.hashSync(req.body.lozinka, 12),
            })
            .save()
            .then((result) => {
                return res.send({
                    msg: "Success!",
                    content: {
                        _id: result._id,
                        username: result.username,
                        token: jwt.sign({
                                _id: result._id,
                                username: result.username,
                            },
                            process.env.JWT_SECRET, {
                                expiresIn: "1h",
                            }
                        ),
                        expiration: 60,
                    },
                });
            })
            .catch((ex) => {
                console.log(ex);
                return res
                    .status(409)
                    .send({ msg: "Error occurred!", content: ex.message });
            });
    } catch (ex) {
        console.log(ex);
        return res.status(501).send({ msg: "Server error occurred!", content: ex });
    }
});

router.post("/login", async(req, res) => {
    try {
        console.log(process.env.JWT_SECRET);
        UserModel.findOne({ username: req.body.username })
            .then((result) => {
                console.log(result);
                bcrypt
                    .compare(req.body.password, result.password)
                    .then((correct) => {
                        if (correct)
                            return res.send({
                                msg: "Success!",
                                content: {
                                    _id: result._id,
                                    username: result.username,
                                    token: jwt.sign({
                                            _id: result._id,
                                            username: result.username,
                                        },
                                        process.env.JWT_SECRET, {
                                            expiresIn: "1h",
                                        }
                                    ),
                                    expiration: 60,
                                },
                            });
                        else
                            return res
                                .status(401)
                                .send({ msg: "Wrong credentials!", content: {} });
                    })
                    .catch((ex) => {
                        console.log(ex);
                        return res
                            .status(409)
                            .send({ msg: "Error occurred!", content: ex });
                    });
            })
            .catch((ex) => {
                console.log(ex);
                return res
                    .status(409)
                    .send({ msg: "Error occurred!", content: ex.message });
            });
    } catch (ex) {
        console.log(ex);
        return res.status(501).send({ msg: "Server error occurred!", content: ex });
    }
});

module.exports = router;
