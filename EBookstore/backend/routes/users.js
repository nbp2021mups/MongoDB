require("dotenv");
const express = require("express");
const router = express.Router();

const { UserModel } = require("../models/usersModel");
const { CartModel } = require("../models/cartsModel");
const { ProductModel } = require("../models/productsModel");
const mongoose = require('mongoose');

router.get("/get-cart/:userID", async(req, res) => {
    try {
        CartModel.find({ korisnik: req.params.userID })
            .skip(req.params.skip)
            .limit(req.params.limit)
            .select(req.params.select)
            .then((result) => {
                return res.send({ poruka: "Uspesno!", sadrzaj: result });
            })
            .catch((err) => {
                console.log(err);
                return res
                    .status(409)
                    .send({ poruka: "Nastala je greska!", sadrzaj: err });
            });
    } catch (ex) {
        console.log(ex);
        return res
            .status(501)
            .send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj: ex });
    }
});

router.post("/add-to-cart", async(req, res) => {
    try {
        if (!req.body.proizvodID)
            return res.status(409).send({ poruka: "Nastala je greska!", sadrzaj: "Niste prosledili proizvodID" });

        if (!req.body.userID)
            return res.status(409).send({ poruka: "Nastala je greska!", sadrzaj: "Niste prosledili userID" });

        if (!req.body.kolicina || req.body.kolicina < 1)
            return res.status(409).send({ poruka: "Nastala je greska!", sadrzaj: "Prosledili ste nevalidnu kolicinu" });

        const session = await mongoose.startSession();
        session.startTransaction();

        const product = await ProductModel.findOneAndUpdate({ _id: req.body.proizvodID }, {
            $inc: {
                kolicina: -req.body.kolicina
            }
        }, { new: true, session }).select('cena kolicina naziv slika proizvodjac poreklo kategorija');

        if (!product) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(409).send({
                poruka: "Nastala je greska!",
                sadrzaj: "Ne postoji proizvod sa zadatim identifikatorom!",
            });
        } else if (product.kolicina < 0) {
            await session.abortTransaction();
            await session.endSession();
            return res
                .status(409)
                .send({
                    poruka: "Nastala je greska!",
                    sadrzaj: "Nema dovoljno proizvoda za narudzbinu!",
                });
        }

        const user = await UserModel.findOneAndUpdate({ _id: req.body.userID }, { $inc: { "korpa.brojProizvoda": req.body.kolicina, "korpa.cena": req.body.kolicina * product.cena } }, { new: true, session }).select('korpa');
        if (!user) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(409).send({
                poruka: "Nastala je greska!",
                sadrzaj: "Ne postoji korisnik sa zadatim identifikatorom!",
            });
        }

        const cart = await CartModel.findOne({ _id: user.korpa.id }).select('brojProizvoda cena proizvodi');
        if (!cart) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(409).send({
                poruka: "Nastala je greska!",
                sadrzaj: "Ne postoji korpa vezana za korisnika!",
            });
        }

        cart.brojProizvoda += req.body.kolicina;
        cart.cena += req.body.kolicina * product.cena;

        const el = cart.proizvodi.find(element => String(element.id) == String(product._id));

        if (el) {
            el.kolicina += req.body.kolicina;
            el.cena += req.body.kolicina * product.cena;
        } else
            cart.proizvodi.push({
                id: product._id,
                naziv: product.naziv,
                cena: req.body.kolicina * product.cena,
                slika: product.slika,
                kolicina: req.body.kolicina,
                proizvodjac: product.proizvodjac,
                poreklo: product.poreklo,
                kategorija: product.kategorija,
            });

        await cart.save({ session });
        await session.commitTransaction();
        await session.endSession();
        return res.send({ msg: "Uspesno!", sadrzaj: {} });
    } catch (ex) {
        console.log(ex);
        return res
            .status(501)
            .send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj: ex });
    }
});

module.exports = router;
