require("dotenv");
const express = require("express");
const router = express.Router();

const { UserModel } = require("../models/usersModel");
const { CartModel } = require("../models/cartsModel");
const { ProductModel } = require("../models/productsModel");
const mongoose = require('mongoose');

router.get("/get-cart/:userID", async(req, res) => {
    try {
        CartModel.findOne({ korisnik: req.params.userID }, { proizvodi: { $slice: [parseInt(req.query.skip), parseInt(req.query.limit)] } })
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

router.get("/get-more-products-from-cart/:cartID", async(req, res) => {
    try {
        CartModel.findOne({ _id: req.params.cartID }, { proizvodi: { $slice: [parseInt(req.query.skip), parseInt(req.query.limit)] } })
            .then((result) => {
                return res.send({ poruka: "Uspesno!", sadrzaj: result.proizvodi });
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

        try {
            const product = await ProductModel.findOne({ _id: req.body.proizvodID })
                .select('cena kolicina naziv slika proizvodjac poreklo kategorija');

            if (!product)
                throw "Ne postoji proizvod sa zadatim identifikatorom!";
            else if (product.kolicina < req.body.kolicina)
                throw "Nema dovoljno proizvoda za narudzbinu!";

            const user = await UserModel.findOneAndUpdate({ _id: req.body.userID }, { $inc: { "korpa.brojProizvoda": req.body.kolicina, "korpa.cena": req.body.kolicina * product.cena } }, { new: true, session }).select('korpa');
            if (!user)
                throw "Ne postoji korisnik sa zadatim identifikatorom!";

            const cart = await CartModel.findOne({ _id: user.korpa.id }).select('brojProizvoda cena proizvodi');
            if (!cart)
                throw "Ne postoji korpa vezana za korisnika!";

            cart.brojProizvoda += req.body.kolicina;
            cart.cena += req.body.kolicina * product.cena;

            const el = cart.proizvodi.find(element => String(element.id) == String(product._id));

            if (el) {
                el.kolicina += req.body.kolicina;
            } else
                cart.proizvodi.push({
                    id: product._id,
                    naziv: product.naziv,
                    cena: product.cena,
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

        } catch (sadrzaj) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(409).send({
                poruka: "Nastala je greska!",
                sadrzaj
            });
        }
    } catch (ex) {
        console.log(ex);
        return res
            .status(501)
            .send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj: ex });
    }
});

router.put("/update-cart/:cartID", async(req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const cart = await CartModel.findOne({ _id: req.params.cartID }, null, { session });

            if (req.body.cena != null && cart.cena != req.body.cena)
                cart.cena = req.body.cena;

            if (req.body.brojProizvoda != null && cart.brojProizvoda != req.body.brojProizvoda)
                cart.brojProizvoda = req.body.brojProizvoda;

            req.body.promenjeni = new Map(Object.entries(req.body.promenjeni));
            req.body.obrisani = new Map(Object.entries(req.body.obrisani));

            if (req.body.obrisani.size > 0)
                cart.proizvodi = cart.proizvodi.filter((p) => !req.body.obrisani.get(String(p.id)));

            if (req.body.promenjeni.size > 0) {
                const products = await ProductModel.find({ _id: { $in: [...req.body.promenjeni.keys()] } }).select('kolicina');

                if (!products.every(p => {
                        const kolicina = req.body.promenjeni.get(String(p._id));
                        return p.kolicina >= kolicina;
                    }))
                    throw "Nema dovoljno proizvoda za dodavanje u korpu!";
            }

            await cart.save({ session });
            const u = await UserModel.updateOne({ _id: cart.korisnik }, { korpa: { cena: cart.cena, brojProizvoda: cart.brojProizvoda, id: cart._id } }, { session, new: true });

            if (u.modifiedCount < 1)
                throw "Korisnikova korpa nije sinhronizovana!";

            await session.commitTransaction();
            await session.endSession();

            return res.send({ poruka: "Uspesno!", sadrzaj: {} });

        } catch (sadrzaj) {
            console.log(sadrzaj)

            await session.abortTransaction();
            await session.endSession();

            return res.status(409).send({ poruka: "Nastala je greska!", sadrzaj });
        }
    } catch (ex) {
        console.log(ex);
        return res
            .status(501)
            .send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj: ex });
    }
});

module.exports = router;