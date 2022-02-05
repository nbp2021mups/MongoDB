const express = require("express");
const router = express.Router();
const storage = require("../storage");
const multer = require("multer");
const mongoose = require("mongoose");

const { BookModel } = require("../models/booksModel");
const { CompanyModel } = require("../models/companiesModel");

router.get("/search", (req, res) => {
    try {
        BookModel.find(JSON.parse(req.query.filter))
            .select(req.query.select)
            .skip(req.query.skip)
            .limit(req.query.count)
            .then((result) => {
                return res.send({ poruka: "Uspesno!", sadrzaj: result });
            })
            .catch((err) => {
                console.log(err);
                return res
                    .status(409)
                    .send({ poruka: "Nastala je greska!", sadrzaj: err.message });
            });
    } catch (ex) {
        console.log(ex);
        return res
            .status(501)
            .send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj: ex });
    }
});

router.delete("/", (req, res) => {
    try {
        BookModel.deleteOne(JSON.parse(req.query.filter))
            .then((result) => {
                return res.send({ poruka: "Uspesno!", sadrzaj: result });
            })
            .catch((err) => {
                console.log(err);
                return res
                    .status(409)
                    .send({ poruka: "Nastala je greska!", sadrzaj: err.message });
            });
    } catch (ex) {
        console.log(ex);
        return res
            .status(501)
            .send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj: ex });
    }
});

router.post(
    "/rent-out",
    multer({ storage: storage }).single("file"),
    async(req, res) => {
        try {
            if (req.file)
                new BookModel({
                    ...req.body,
                    image: req.protocol +
                        "://" +
                        req.get("host") +
                        "/images/" +
                        req.file.filename,
                })
                .save()
                .then((result) => {
                    return res.send({ poruka: "Uspesno!", sadrzaj: result });
                })
                .catch((err) => {
                    console.log(err);
                    return res
                        .status(409)
                        .send({ poruka: "Nastala je greska!", sadrzaj: err.message });
                });
            else
                return res
                    .status(409)
                    .send({
                        poruka: "Nastala je greska!",
                        sadrzaj: "Potrebno je ubaciti sliku!",
                    });
        } catch (ex) {
            console.log(ex);
            return res.status(501).send({
                poruka: "Nastala je greska na serverskoj strani!",
                sadrzaj: ex,
            });
        }
    }
);

router.post(
    "/put-up-for-sale",
    multer({ storage: storage }).single("file"),
    async(req, res) => {
        try {
            const _id = new mongoose.Types.ObjectId();
            if (req.file && req.body.company)
                CompanyModel.updateOne({ pib: req.body.company }, { $push: { offeredProducts: _id } })
                .then((result1) => {
                    if (result1.matchedCount > 0)
                        new BookModel({
                            ...req.body,
                            company: null,
                            _id,
                            image: req.protocol +
                                "://" +
                                req.get("host") +
                                "/images/" +
                                req.file.filename,
                        })
                        .save()
                        .then((result) => {
                            return res.send({ poruka: "Uspesno!", sadrzaj: result });
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.status(409).send({
                                poruka: "Nastala je greska!",
                                sadrzaj: err.message,
                            });
                        });
                    else
                        return res.status(409).send({
                            poruka: "Nastala je greska!",
                            sadrzaj: "Kompanija ne postoji!",
                        });
                })
                .catch((ex) => {
                    console.log(ex);
                    return res
                        .status(409)
                        .send({ poruka: "Nastala je greska!", sadrzaj: ex });
                });
            else if (req.file)
                return res.status(409).send({
                    poruka: "Nastala je greska!",
                    sadrzaj: "Potrebno je ubaciti sliku!",
                });
            else
                return res.status(409).send({
                    poruka: "Greska!",
                    sadrzaj: "Morate navesti pib kompanije!",
                });
        } catch (ex) {
            console.log(ex);
            return res.status(501).send({
                poruka: "Nastala je greska na serverskoj strani!",
                sadrzaj: ex,
            });
        }
    }
);

module.exports = router;
