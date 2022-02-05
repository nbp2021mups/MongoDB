require("dotenv");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { CompanyModel } = require("../models/companiesModel");
const { UserModel } = require("../models/usersModel");

router.post("/register-user", async(req, res) => {
    try {
        const korisnik = await CompanyModel.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.email },
                { telefon: req.body.telefon },
            ],
        });

        if (!korisnik) {
            new UserModel({
                    ...req.body,
                    lozinka: bcrypt.hashSync(req.body.lozinka, 12),
                })
                .save()
                .then((result) =>
                    res.send({
                        poruka: "Uspesno!",
                        sadrzaj: {
                            ...result._doc,
                            lozinka: null,
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
                    })
                )
                .catch((err) => {
                    console.log(err);
                    res
                        .status(409)
                        .send({
                            poruka: "Nastala je Nastala je greska!",
                            sadrzaj: err.message,
                        });
                });
        } else if (korisnik.username == req.body.username)
            return res.status(409).send({
                poruka: "Nastala je greska!",
                sadrzaj: `Korisnicko ime "${req.body.username}" je zauzeto!`,
            });
        else if (korisnik.email === req.body.email)
            return res.status(409).send({
                poruka: "Nastala je greska!",
                sadrzaj: `Email adresa "${req.body.email}" je zauzeta!`,
            });
        else
            return res.status(409).send({
                poruka: "Nastala je greska!",
                sadrzaj: `Telefon "${req.body.telefon}" je zauzet!`,
            });
    } catch (ex) {
        console.log(ex);
        return res
            .status(501)
            .send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj: ex });
    }
});

router.post("/register-company", async(req, res) => {
    try {
        const korisnik = await UserModel.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.email },
                { telefon: req.body.telefon },
            ],
        });

        if (!korisnik) {
            new CompanyModel({
                    ...req.body,
                    lozinka: bcrypt.hashSync(req.body.lozinka, 12),
                })
                .save()
                .then((result) =>
                    res.send({
                        poruka: "Uspesno!",
                        sadrzaj: {
                            ...result._doc,
                            lozinka: null,
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
                    })
                )
                .catch((err) => {
                    console.log(err);
                    res
                        .status(409)
                        .send({ poruka: "Nastala je greska!", sadrzaj: err.message });
                });
        } else if (korisnik.username == req.body.username)
            return res.status(409).send({
                poruka: "Nastala je greska!",
                sadrzaj: `Korisnicko ime "${req.body.username}" je zauzeto!`,
            });
        else if (korisnik.email === req.body.email)
            return res.status(409).send({
                poruka: "Nastala je greska!",
                sadrzaj: `Email adresa "${req.body.email}" je zauzeta!`,
            });
        else
            return res.status(409).send({
                poruka: "Nastala je greska!",
                sadrzaj: `Telefon "${req.body.telefon}" je zauzet!`,
            });
    } catch (ex) {
        console.log(ex);
        return res
            .status(501)
            .send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj: ex });
    }
});

router.post("/login", async(req, res) => {
    try {
        let user = await UserModel.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username },
                { telefon: req.body.telefon },
            ],
        });
        if (!user) {
            user = await CompanyModel.findOne({
                $or: [
                    { pib: req.body.pib },
                    { username: req.body.username },
                    { email: req.body.username },
                    { telefon: req.body.telefon },
                ],
            });
        }

        if (!user)
            return res.status(401).send({
                poruka: "Nastala je greska!",
                sadrzaj: "Prosledjeni podaci ne odgovaraju nijednom korisniku!",
            });
        else {
            bcrypt
                .compare(req.body.lozinka, user.lozinka)
                .then((correct) => {
                    if (correct)
                        return res.send({
                            poruka: "Uspesno!",
                            sadrzaj: {
                                ...user._doc,
                                token: jwt.sign({
                                        _id: user._id,
                                        username: user.username,
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
                            .send({
                                poruka: "Nastala je greska!",
                                sadrzaj: "Pogresna lozinka!",
                            });
                })
                .catch((ex) => {
                    console.log(ex);
                    return res
                        .status(409)
                        .send({ poruka: "Nastala je greska!", sadrzaj: ex });
                });
        }
    } catch (ex) {
        console.log(ex);
        return res
            .status(501)
            .send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj: ex });
    }
});

module.exports = router;
