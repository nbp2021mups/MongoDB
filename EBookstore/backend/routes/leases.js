require("dotenv");
const express = require("express");
const router = express.Router();

const { UserModel } = require("../models/usersModel");
const { ProductModel } = require("../models/productsModel");
const { LeaseModel } = require("../models/leasesModel");
const { sendEmail } = require('../mailer');
const mongoose = require("mongoose");

router.get('/offered/:userID', async(req, res) => {
    try {
        ProductModel.find({ kategorija: 'knjiga na izdavanje', "poreklo.id": req.params.userID })
            .skip(req.query.skip)
            .limit(req.query.limit)
            .select(req.query.select)
            .sort(JSON.parse(req.query.sort))
            .then(sadrzaj => res.send({ poruka: "Uspesno!", sadrzaj }))
            .catch(sadrzaj => res.send({ poruka: "Nastala je greska!", sadrzaj }));
    } catch (sadrzaj) {
        res.status(501).send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj });
    }
});

router.get('/leased', async(req, res) => {
    try {
        LeaseModel.find(JSON.parse(req.query.filter))
            .skip(req.query.skip)
            .limit(req.query.limit)
            .select(req.query.select)
            .sort(JSON.parse(req.query.sort))
            .then(sadrzaj => {
                res.send({ poruka: "Uspesno!", sadrzaj });
            })
            .catch(sadrzaj => res.send({ poruka: "Nastala je greska!", sadrzaj }));
    } catch (sadrzaj) {
        console.log(sadrzaj);
        res.status(501).send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj });
    }
});

router.post('/', async(req, res) => {
    try {
        const korisnici = await UserModel.find({ _id: { $in: [req.body.korisnikZajmi, req.body.korisnikPozajmljuje] } })
            .select('ime prezime adresa email telefon');

        if (korisnici.length != 2)
            return res.status(409).send({ poruka: "Nastala je greska!", sadrzaj: "ID korisnika nisu validni!" });

        const knjiga = await ProductModel.findOne({ _id: req.body.knjiga, "poreklo.id": req.body.korisnikZajmi })
            .select('naziv proizvodjac slika autor zanr cena');

        if (knjiga == null)
            return res.status(409).send({ poruka: "Nastala je greska!", sadrzaj: "ID knjige nije validan!" });

        const zajmi = korisnici.find(k => String(k._id) == String(req.body.korisnikZajmi)),
            pozajmljuje = korisnici.find(k => String(k._id) == String(req.body.korisnikPozajmljuje));

        if (new Date(req.body.odDatuma) > new Date(req.body.doDatuma))
            return res.status(409).send({ poruka: "Nastala je greska!", sadrzaj: "Datum od izdavanja je veci od datuma do kraja izdavanja!" })

        new LeaseModel({
                ...req.body,
                korisnikZajmi: {
                    ...zajmi._doc,
                    id: zajmi._id
                },
                korisnikPozajmljuje: {
                    ...pozajmljuje._doc,
                    id: pozajmljuje._id
                },
                knjiga: {
                    ...knjiga._doc,
                    id: knjiga._id
                }
            })
            .save()
            .then(sadrzaj => res.send({ poruka: "Uspesno!", sadrzaj }))
            .catch(sadrzaj => res.send({ poruka: "Nastala je greska!", sadrzaj }));

    } catch (sadrzaj) {
        console.log(sadrzaj);
        res.status(501).send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj });
    }
});

router.patch('/response', async(req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const lease = {};
            if (req.body.response == 1) {
                lease.value = await LeaseModel.findOneAndUpdate({ _id: req.body.leaseID }, { $set: { potvrdjeno: req.body.response } }, { new: true, session }).select('doDatuma knjiga');
                if (lease.value) {
                    const update = await ProductModel.updateOne({ _id: lease.value.knjiga.id }, { $set: { izdataDo: lease.value.doDatuma } }, { session });
                    if (update.matchedCount != 1 || update.modifiedCount < 1)
                        throw "Nema knjige sa prosledjenim identifikatorom!";
                }
            } else if (req.body.response == -1) {
                lease.value = await LeaseModel.findOneAndDelete({ _id: req.body.leaseID }, { new: true, session });
                if (lease.value)
                    await sendEmail(lease.value.korisnikZajmi.email, "Odbijen zahtev za zajam",
                        `<h1>Korisnik ${lease.value.korisnikPozajmljuje.ime} ${lease.value.korisnikPozajmljuje.prezime} je odbio/la Vaš zahtev za zajam knjige</h1>
                        <h4>Knjiga: '${lease.value.knjiga.naziv}' autora ${lease.value.knjiga.autor}</h4>
                        <h5>Po ceni od ${lease.value.cena} dinara za period ${new Date(lease.value.odDatuma).toLocaleDateString()} - ${new Date(lease.value.doDatuma).toLocaleDateString()}</h5>
                        <br/>
                        <br/>
                        <h4>Kontakt:</h4>
                        <label>email: ${ lease.value.korisnikPozajmljuje.email }</label><br/>
                        <label>telefon: ${ lease.value.korisnikPozajmljuje.telefon }</label>`);
            } else
                throw "Nevalidna vrednost odgovora!";

            if (!lease.value)
                throw "Nema zajma sa prosledjenim identifikatorom!"

            await session.commitTransaction();
            await session.endSession();
            res.send({ poruka: "Uspesno!", sadrzaj: {} });

        } catch (sadrzaj) {
            console.log(sadrzaj);
            await session.abortTransaction();
            await session.endSession();
            res.status(501).send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj });
        }
    } catch (sadrzaj) {
        console.log(sadrzaj);
        res.status(501).send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj });
    }
});

module.exports = router;