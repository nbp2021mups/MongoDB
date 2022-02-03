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
                return res.send({ msg: "Success!", content: result });
            })
            .catch((err) => {
                console.log(err);
                return res
                    .status(409)
                    .send({ msg: "Error occurred!", content: err.message });
            });
    } catch (ex) {
        console.log(ex);
        return res.status(501).send({ msg: "Server error occurred!", content: ex });
    }
});

router.delete("/", (req, res) => {
    try {
        BookModel.deleteOne(JSON.parse(req.query.filter))
            .then((result) => {
                return res.send({ msg: "Success!", content: result });
            })
            .catch((err) => {
                console.log(err);
                return res
                    .status(409)
                    .send({ msg: "Error occurred!", content: err.message });
            });
    } catch (ex) {
        console.log(ex);
        return res.status(501).send({ msg: "Server error occurred!", content: ex });
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
                    return res.send({ msg: "Success!", content: result });
                })
                .catch((err) => {
                    console.log(err);
                    return res
                        .status(409)
                        .send({ msg: "Error occurred!", content: err.message });
                });
            else
                return res
                    .status(409)
                    .send({ msg: "Request must include an image file!", content: {} });
        } catch (ex) {
            console.log(ex);
            return res
                .status(501)
                .send({ msg: "Server error occurred!", content: ex });
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
                            return res.send({ msg: "Success!", content: result });
                        })
                        .catch((err) => {
                            console.log(err);
                            return res
                                .status(409)
                                .send({ msg: "Error occurred!", content: err.message });
                        });
                    else
                        return res
                            .status(409)
                            .send({ msg: "Error company doesn't exist", content: {} });
                })
                .catch((ex) => {
                    console.log(ex);
                    return res
                        .status(409)
                        .send({ msg: "Error occurred!", content: ex });
                });
            else if (req.file)
                return res
                    .status(409)
                    .send({ msg: "Request must include an image file!", content: {} });
            else
                return res
                    .status(409)
                    .send({ msg: "Request must include a company field!", content: {} });
        } catch (ex) {
            console.log(ex);
            return res
                .status(501)
                .send({ msg: "Server error occurred!", content: ex });
        }
    }
);

module.exports = router;
