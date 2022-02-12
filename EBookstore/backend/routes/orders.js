const express = require("express");
const router = express.Router();

const { OrderModel } = require("../models/ordersModel");
const { CartModel } = require("../models/cartsModel");
const { UserModel } = require("../models/usersModel");
const { ProductModel } = require("../models/productsModel");

const mongoose = require("mongoose");
const { sendEmail } = require("../mailer");

// Potvrdivanje narudzbine
router.patch("/accept", async(req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const order = await OrderModel.findOneAndUpdate({ _id: req.body.orderID }, { $set: { "status.potvrdjena": 1 } }, { session });
            if (!order)
                throw "Ne postoji narudzbina sa prosledjenim identifikatorom!";

            let products = await ProductModel.find({ _id: { $in: [...order.proizvodi.map(p => p.id)] } }).select('kolicina');
            if (products.length != order.proizvodi.length)
                throw "Nema svih proizvoda!";

            products = products.reduce((acc, el) => ({...acc, [String(el._id)]: el }), {});

            if (!order.proizvodi.every(p => {
                    products[String(p.id)].kolicina -= p.kolicina;
                    return products[String(p.id)].kolicina >= 0;
                }))
                throw "Nema dovoljno proizvoda!";

            await ProductModel.bulkSave([...Object.values(products)], { session });

            const userOrder = await OrderModel.findOneAndUpdate({ _id: order.status.celaNarudzbina }, {
                $pull: { "status.naCekanju": order.kompanija },
                $push: { "status.potvrdili": order.kompanija }
            }, { new: true, session }).select('status');

            if (userOrder.status.naCekanju.length == 0) {
                userOrder.status.potvrdjena = 1;
                await userOrder.save({ session });
            }

            await session.commitTransaction();
            await session.endSession();

            return res.send({ poruka: "Uspesno!", sadrzaj: order })

        } catch (sadrzaj) {
            await session.abortTransaction();
            await session.endSession();

            console.log(sadrzaj);
            return res.status(401).send({ poruka: "Nastala je greska! ", sadrzaj });
        }

    } catch (ex) {
        console.log(ex);
        return res.status(501).send("Došlo je do greške prilikom prihvatanja porudžbine, pokušajte ponovo.");
    }
});

// Odbijanje narudzbine
router.patch("/decline", async(req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const order = await OrderModel.findOneAndUpdate({ _id: req.body.orderID }, { $set: { "status.potvrdjena": -1 } }, { new: true, session })
                .populate({
                    path: 'korisnik',
                    select: 'email',
                    model: 'user'
                })
                .populate({
                    path: 'kompanija',
                    select: 'naziv email telefon',
                    model: 'company'
                })
                .select('kompanija korisnik proizvodi status cena brojProizvoda');

            if (!order)
                throw "Ne postoji narudzbina sa tim identifikatorom!";

            const userOrder = await OrderModel.findOneAndUpdate({ _id: order.status.celaNarudzbina }, {
                    $inc: { cena: -order.cena, brojProizvoda: -order.brojProizvoda },
                    $push: { "status.odbili": order.kompanija._id },
                    $pull: { "status.naCekanju": order.kompanija._id, proizvodi: { id: { $in: [...order.proizvodi.map(p => p.id)] } } }
                }, { new: true, session })
                .select('status');

            if (!userOrder)
                throw "Narudzbina nije korektno povezana!";

            if (userOrder.status.naCekanju.length == 0) {
                userOrder.status.potvrdjena = 1;
                await userOrder.save({ session });
            }

            await sendEmail(order.korisnik.email, "Odbijena narudžbina",
                `<h1>Kompanija '${ order.kompanija.naziv }' je odbila svoj deo Vaše narudžbine</h1>
                ${ order.proizvodi.map(p => "<li>" + p.naziv + " x " + p.kolicina + "</li>\n") }
                <h3>Ukoliko ste nezadovoljni ovim, možete  otkazati svoju narudžbinu u potpunosti</h3>
                <br/>
                <br/>
                <h2>Kontakt kompanije:</h2>
                <label>email: ${ order.kompanija.email }</label><br/>
                <label>telefon: ${ order.kompanija.telefon }</label>`);

            await session.commitTransaction();
            await session.endSession();
            return res.send({ poruka: "Uspešno! ", sadrzaj: {} });

        } catch (sadrzaj) {
            console.log(sadrzaj);
            await session.abortTransaction();
            await session.endSession();
            res.status(409).send({ poruka: "Nastala je greska!", sadrzaj });
        }
    } catch (ex) {
        console.log(ex);
        return res.status(501).send("Došlo je do greške prilikom odbijanja porudžbine, pokušajte ponovo.");
    }
});

router.delete('/:orderID', async(req, res) => {
    try {

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const userOrder = await OrderModel.findOneAndDelete({ _id: req.params.orderID, kategorija: "korisnik" }, { new: true, session })
                .select('korisnik proizvodi status').populate('korisnik', 'ime prezime email telefon');

            if (!userOrder)
                throw "Ne postoji narudzbina sa tim identifikatorom!";

            const potvrdili = userOrder.status.potvrdili.reduce((acc, el) => ({...acc, [String(el)]: true }), {});

            const orders = await OrderModel.find({ kategorija: "kompanija", "status.celaNarudzbina": userOrder._id }).populate('kompanija', 'email');

            const proizvodi = {};

            orders.forEach(o => {
                if (potvrdili[String(o.kompanija._id)]) {
                    o.proizvodi.forEach(p => {
                        proizvodi[String(p.id)] = {
                            id: p.id,
                            naziv: p.naziv,
                            kolicina: p.kolicina
                        };
                    })
                    potvrdili[String(o.kompanija._id)] = {
                        email: o.kompanija.email,
                        proizvodi: o.proizvodi
                    };
                }
            });

            await OrderModel.deleteMany({ _id: { $in: [...orders.map(o => o._id)] } }, { session });

            const products = await ProductModel.find({ _id: { $in: [...Object.keys(proizvodi)] } }).select('kolicina');
            products.forEach(p => p.kolicina += proizvodi[String(p._id)].kolicina);
            await ProductModel.bulkSave(products, { session });

            for (const v of Object.values(potvrdili))
                await sendEmail(v.email, "Otkazana narudžbina",
                    `<h1>Korisnik '${ userOrder.korisnik.ime } ${ userOrder.korisnik.prezime }' je otkazao/la svoju narudžbinu</h1>
                    ${ v.proizvodi.map(p => "<li>" + p.naziv + " x " + p.kolicina + "</li>\n") }
                    <h3>Navedene zalihe proizvoda Vaše kompanije su ponovo dostupne za druge korisnike!</h3>
                    <br/>
                    <br/>
                    <h2>Kontakt korisnika:</h2>
                    <label>email: ${ userOrder.korisnik.email }</label><br/>
                    <label>telefon: ${ userOrder.korisnik.telefon }</label>`);

            await UserModel.updateOne({ _id: userOrder.korisnik._id }, { $pull: userOrder._id });

            await session.commitTransaction();
            await session.endSession();
            return res.send({ poruka: "Uspešno! ", sadrzaj: {} });

        } catch (sadrzaj) {
            console.log(sadrzaj);
            await session.abortTransaction();
            await session.endSession();
            res.status(409).send({ poruka: "Nastala je greska!", sadrzaj });
        }
    } catch (ex) {
        console.log(ex);
        return res.status(501).send("Došlo je do greške prilikom odbijanja porudžbine, pokušajte ponovo.");
    }
});

router.get("/", async(req, res) => {
    try {
        OrderModel.find(JSON.parse(req.query.filter))
            .skip(req.query.skip)
            .limit(req.query.limit)
            .select(req.query.select)
            .sort(JSON.parse(req.query.sort))
            .then(sadrzaj => res.send({ poruka: "Uspesno!", sadrzaj }))
            .catch(sadrzaj => {
                console.log(sadrzaj);
                res.status(409).send({ poruka: "Nastala je greska!", sadrzaj });
            });
    } catch (sadrzaj) {
        console.log(sadrzaj);
        return res.status(501).send({ poruka: "Došlo je do greške na serverskoj strani!", sadrzaj });
    }
});

router.get("/get-user-info/:userID", async(req, res) => {
    try {
        UserModel.findOne({ _id: req.params.userID })
            .select('ime prezime email telefon adresa')
            .then(sadrzaj => res.send({ poruka: "Uspesno!", sadrzaj }))
            .catch(sadrzaj => {
                console.log(sadrzaj);
                return res.status(409).send({ poruka: "Nastala je greska!", sadrzaj });
            });
    } catch (sadrzaj) {
        console.log(sadrzaj);
        return res.status(501).send({ poruka: "Došlo je do greške na serverskoj strani!", sadrzaj });
    }
});

router.get("/get-products/:orderID", async(req, res) => {
    try {
        OrderModel.findOne({ _id: req.params.orderID }, { proizvodi: { $slice: [parseInt(req.query.skip), parseInt(req.query.limit)] } })
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

router.post("/", async(req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const cart = await CartModel.findOne({ _id: req.body.cartID });
            if (!cart)
                throw "Korpa sa prosledjenim identifikatorom nije pronadjena!";

            if (req.body.cena != null && cart.cena != req.body.cena)
                cart.cena = req.body.cena;

            if (req.body.brojProizvoda != null && cart.brojProizvoda != req.body.brojProizvoda)
                cart.brojProizvoda = req.body.brojProizvoda;

            req.body.promenjeni = new Map(Object.entries(req.body.promenjeni ? req.body.promenjeni : {}));
            req.body.obrisani = new Map(Object.entries(req.body.obrisani ? req.body.obrisani : {}));

            if (req.body.promenjeni.size > 0) {
                const products = await ProductModel.find({ _id: { $in: [...req.body.promenjeni.keys()] } }, null, { session }).select('kolicina');

                if (!products.every(p => {
                        const kolicina = req.body.promenjeni.get(String(p._id));
                        return p.kolicina >= kolicina;
                    }))
                    throw "Nema dovoljno proizvoda za dodavanje u korpu!";
            }

            const orders = new Map();
            const _id = new mongoose.Types.ObjectId();

            cart.proizvodi.forEach(p => {
                if (!req.body.obrisani.has(String(p.id))) {
                    const kolicina = req.body.promenjeni.get(String(p.id));
                    if (kolicina)
                        p.kolicina += kolicina;

                    if (!orders.has(String(p.poreklo.id)))
                        orders.set(String(p.poreklo.id), new OrderModel({
                            kompanija: p.poreklo.id,
                            korisnik: cart.korisnik,
                            kategorija: 'kompanija',
                            cena: 0,
                            brojProizvoda: 0,
                            proizvodi: [],
                            status: {
                                potvrdjena: 0,
                                celaNarudzbina: _id
                            },
                            datum: new Date().toISOString()
                        }));

                    const o = orders.get(String(p.poreklo.id));
                    o.cena += p.cena * p.kolicina;
                    o.brojProizvoda += p.kolicina;
                    o.proizvodi.push(p);
                }
            });

            await OrderModel.bulkSave([...orders.values()], { session });

            const order = await new OrderModel({
                _id,
                korisnik: cart.korisnik,
                cena: cart.cena,
                brojProizvoda: cart.brojProizvoda,
                proizvodi: cart.proizvodi,
                kategorija: 'korisnik',
                status: {
                    vrednost: 0,
                    potvrdili: [],
                    odbili: [],
                    naCekanju: [...orders.keys()]
                },
                datum: new Date().toISOString()
            }).save({ session });

            cart.cena = 0;
            cart.brojProizvoda = 0;
            cart.proizvodi = [];
            await cart.save({ session });

            const u = await UserModel.updateOne({ _id: cart.korisnik }, {
                $set: { "korpa.cena": 0, "korpa.brojProizvoda": 0 },
                $push: { narudzbine: order._id }
            }, { session });

            if (u.modifiedCount < 1)
                throw "Korisnik nije korektno sinhronizovan!";

            await session.commitTransaction();
            await session.endSession();

            return res.send({ poruka: "Uspesno!", sadrzaj: order });

        } catch (sadrzaj) {
            await session.abortTransaction();
            await session.endSession();

            console.log(sadrzaj);
            return res.status(409).send({ poruka: "Nastala je greska!", sadrzaj });
        }
    } catch (sadrzaj) {
        console.log(sadrzaj);
        return res.status(501).send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj });
    }
});

module.exports = router;
