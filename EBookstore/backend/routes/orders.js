const express = require("express");
const router = express.Router();

const { OrderModel } = require("../models/ordersModel");
const { CartModel } = require("../models/cartsModel");
const { UserModel } = require("../models/usersModel");
const { ProductModel } = require("../models/productsModel");

const mongoose = require("mongoose");

//potvrdivanje narudzbine
router.patch("/accept", async(req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const order = await OrderModel.findOneAndUpdate({ _id: req.body.orderID }, { $set: { "potvrdjena.vrednost": 1 } }, { session });
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

            const userOrder = await OrderModel.findOneAndUpdate({ _id: order.potvrdjena.userOrder }, { $pull: { "potvrdjena.ukupno": order.kompanija }, $push: { "potvrdjena.od": order.kompanija } }, { new: true, session });
            if (userOrder.potvrdjena.ukupno.length == 0) {
                userOrder.potvrdjena.vrednost = 1;
                await userOrder.save({ session });
                // await OrderModel.deleteMany({ _id: { $in: userOrder.od }});
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

//odbijanje narudzbine
router.patch("/decline", async(req, res) => {
    try {
        OrderModel.findOneAndUpdate({ _id: orderID }, { $set: { "potvrdjena.vrednost": -1 } }, { new: true })
            .then(sadrzaj => res.send({ msg: "Uspesno!", sadrzaj }))
            .catch(sadrzaj => {
                console.log(sadrzaj);
                res.status(409).send({ msg: "Nastala je greska!", sadrzaj });
            })
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
                            potvrdjena: {
                                vrednost: 0,
                                userOrder: _id
                            },
                            datum: new Date()
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
                potvrdjena: {
                    vrednost: 0,
                    od: [],
                    ukupno: [...orders.keys()]
                },
                datum: new Date()
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