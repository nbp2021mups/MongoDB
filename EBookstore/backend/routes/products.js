const express = require("express");
const router = express.Router();
const storage = require("../storage");
const multer = require("multer");
const fs = require("fs");

const { ProductModel } = require("../models/productsModel");
const { CompanyModel } = require("../models/companiesModel");
const { UserModel } = require("../models/usersModel");
const mongoose = require('mongoose');

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
router.get("/findByCompany/:companyId", (req, res) => {
    try {
        ProductModel.find({"poreklo.id" : req.params.companyId})
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
//--Naziv proizvoda
//--Proizvodjac
//--Autor
//--Zanr

//Cena --> Opseg ili vise opsega

//Sortiranje --> Ceni A D  Nazivu A D 
router.get("/getBooks/:autor", (req, res) => {
    try {
        pera:{
            autor:req.params.autor
        }
        ProductModel.find(pera)
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
//Drustvene igre
router.get("/getGames", (req, res) => {
    try {
        ProductModel.find({proizvodjac: req.query.producer,naziv: req.query.name,$and:[{cena:{$gte: req.query.lower},cena:{$lte: req.query.greater}}]})
            .select(req.query.select)
            .skip(req.query.skip)
            .limit(req.query.count)
            .sort(req.query.field,req.query.ascdesc)
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
//Slagalice
router.get("/getPuzzle", (req, res) => {
    try {
        ProductModel.find({proizvodjac: req.query.producer,naziv: req.query.name,autor:req.query.author,zanr: req.query.genre,$and:[{cena:{$gte: req.query.lower},cena:{$lte: req.query.greater}}]})
            .select(req.query.select)
            .skip(req.query.skip)
            .limit(req.query.count)
            .sort(req.query.field,req.query.ascdesc)
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
//Rancevi
router.get("/getBackbacks", (req, res) => {
    try {
        ProductModel.find({proizvodjac: req.query.producer,naziv: req.query.name,autor:req.query.author,zanr: req.query.genre,$and:[{cena:{$gte: req.query.lower},cena:{$lte: req.query.greater}}]})
            .select(req.query.select)
            .skip(req.query.skip)
            .limit(req.query.count)
            .sort(req.query.field,req.query.ascdesc)
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
//Privesci
router.get("/getKeychain", (req, res) => {
    try {
        ProductModel.find({proizvodjac: req.query.producer,naziv: req.query.name,autor:req.query.author,zanr: req.query.genre,$and:[{cena:{$gte: req.query.lower},cena:{$lte: req.query.greater}}]})
            .select(req.query.select)
            .skip(req.query.skip)
            .limit(req.query.count)
            .sort(req.query.field,req.query.ascdesc)
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
//Sveske
router.get("/getNotebooks", (req, res) => {
    try {
        ProductModel.find({proizvodjac: req.query.producer,naziv: req.query.name,autor:req.query.author,zanr: req.query.genre,$and:[{cena:{$gte: req.query.lower},cena:{$lte: req.query.greater}}]})
            .select(req.query.select)
            .skip(req.query.skip)
            .limit(req.query.count)
            .sort(req.query.field,req.query.ascdesc)
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

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const product = await new ProductModel({
                    ...req.body,
                    slika: req.protocol +
                        "://" +
                        req.get("host") +
                        "/images/" +
                        (req.file ?
                            req.file.filename :
                            "template-" + req.body.kategorija + ".png"),
                })
                .save();

            let update;
            if (req.body.poreklo.naziv)
                update = await CompanyModel.updateOne({ _id: req.body.poreklo.id }, { $push: { ponudjeniProizvodi: product._id } });
            else if (req.body.kategorija == "knjiga za iznajmljivanje")
                update = await UserModel.updateOne({ _id: req.body.poreklo.id }, { $push: { iznajmljuje: product._id } });
            else
                throw "Korisnici mogu samo knjige da postavljaju na iznajmljivanje!";

            if (update.modifiedCount == 0)
                throw "Neispravno poreklo!";

            await session.commitTransaction();
            await session.endSession();

            return res.send({ poruka: "Uspesno", sadrzaj: product._doc });
        } catch (sadrzaj) {
            if (req.file)
                fs.unlinkSync(req.file.path);

            await session.abortTransaction();
            await session.endSession();
            return res.status(409).send({ poruka: "Nastala je greska!", sadrzaj });
        }
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