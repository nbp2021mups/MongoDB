const express = require("express");
const router = express.Router();
const storage = require("../storage");
const multer = require("multer");
const fs = require("fs");

const { ProductModel } = require("../models/productsModel");
const { CompanyModel } = require("../models/companiesModel");
const { ObjectId } = require("mongoose").Types;

router.get("/search", (req, res) => {
    try {
        ProductModel.find(JSON.parse(req.query.filter))
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

router.post("/", multer({ storage }).single("file"), async(req, res) => {
    try {
        req.body.poreklo = JSON.parse(req.body.poreklo);
        if (!req.body.poreklo ||
            !req.body.poreklo.id ||
            (!req.body.poreklo.naziv &&
                (!req.body.poreklo.ime || !req.body.poreklo.prezime))
        ) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(409).send({
                poruka: "Nastala je greska!",
                sadrzaj: "Morate proslediti ispravno poreklo proizvoda!",
            });
        }

        const _id = new ObjectId();
        if (req.body.poreklo.naziv) {
            const update = await CompanyModel.updateOne({ _id: req.body.poreklo.id }, { $push: { ponudjeniProizvodi: _id } });
            if (update.modifiedCount == 0) {
                if (req.file) fs.unlinkSync(req.file.path);
                return res.status(409).send({
                    poruka: "Nastala je greska!",
                    sadrzaj: "Ne postoji knjizara sa prosledjenim identifikatorom!",
                });
            }
        }
        new ProductModel({
                ...req.body,
                _id,
                slika: req.protocol +
                    "://" +
                    req.get("host") +
                    "/images/" +
                    (req.file ?
                        req.file.filename :
                        "template-" + req.body.kategorija + ".png"),
            })
            .save()
            .then((response) => {
                return res.send({ poruka: "Uspesno!", sadrzaj: response });
            })
            .catch((err) => {
                if (req.file) fs.unlinkSync(req.file.path);
                console.log(err);
                return res
                    .status(409)
                    .send({ poruka: "Nastala je greska!", sadrzaj: err.message });
            });
    } catch (ex) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.log(ex);
        return res
            .status(501)
            .send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj: ex });
    }
});

router.put("/", (req, res) => {
    try {
        ProductModel.updateOne(req.body.filter, req.body.update)
            .then((response) => {
                return res.send({ poruka: "Uspesno!", sadrzaj: response });
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
        ProductModel.deleteOne(JSON.parse(req.query.filter))
            .then((response) => {
                return res.send({ poruka: "Uspesno!", sadrzaj: response });
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

module.exports = router;
