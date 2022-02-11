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

        if (new Date(req.body.odDatuma) > new Date(req.body.doDatuma))
            return res.status(409).send({ poruka: "Nastala je greska!", sadrzaj: "Datum od izdavanja je veci od datuma do kraja izdavanja!" });

        req.body.korisnikPozajmljuje = new mongoose.Types.ObjectId(req.body.korisnikPozajmljuje);
        req.body.korisnikZajmi = new mongoose.Types.ObjectId(req.body.korisnikZajmi);

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const knjiga = await ProductModel.findOne({
                    _id: req.body.knjiga,
                    "poreklo.id": req.body.korisnikZajmi
                },
                null, { session }).select('naziv proizvodjac slika autor zanr cena zahtevaliZajam');

            if (knjiga == null)
                throw "ID knjige nije validan!";

            if (knjiga.zahtevaliZajam.find(z => String(z) == String(req.body.korisnikPozajmljuje)))
                throw "Vec ste poslali zahtev za ovaj proizvod!";

            const zajmi = korisnici.find(k => String(k._id) == String(req.body.korisnikZajmi)),
                pozajmljuje = korisnici.find(k => String(k._id) == String(req.body.korisnikPozajmljuje));

            const lease = await new LeaseModel({
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
                .save({ session });

            const u = await ProductModel.updateOne({ _id: knjiga._id }, { $push: { zahtevaliZajam: req.body.korisnikPozajmljuje } }, { session });
            if (u.modifiedCount != 1)
                throw "Knjiga nije azurirana!";

            await session.commitTransaction();
            await session.endSession();

            return res.send({ poruka: "Uspesno!", sadrzaj: lease });

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

router.patch('/response', async(req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const lease = {};

            if (req.body.response == 1) {
                lease.value = await LeaseModel.findOneAndUpdate({ _id: req.body.leaseID }, { $set: { potvrdjeno: req.body.response } }, { new: true, session }).select('doDatuma knjiga korisnikPozajmljuje');
                lease.update = { $set: { izdataDo: lease.value.doDatuma }, $pull: { zahtevaliZajam: lease.value.korisnikPozajmljuje.id } };
            } else if (req.body.response == -1) {
                lease.value = await LeaseModel.findOneAndDelete({ _id: req.body.leaseID }, { new: true, session });
                lease.update = { $pull: { zahtevaliZajam: lease.value.korisnikPozajmljuje.id } };
            } else
                throw "Nevalidna vrednost odgovora!";

            if (!lease.value)
                throw "Nema zajma sa prosledjenim identifikatorom!"

            lease.update = await ProductModel.updateOne({ _id: lease.value.knjiga.id }, lease.update, { session });

            if (lease.update.matchedCount != 1 || lease.update.modifiedCount < 1)
                throw "Knjiga nije azurirana!";

            if (req.body.response == -1)
                await sendEmail(lease.value.korisnikZajmi.email, "Odbijen zahtev za zajam",
                    `<h1>Korisnik ${lease.value.korisnikPozajmljuje.ime} ${lease.value.korisnikPozajmljuje.prezime} je odbio/la Vaš zahtev za zajam knjige</h1>
                  <h4>Knjiga: '${lease.value.knjiga.naziv}' autora ${lease.value.knjiga.autor}</h4>
                  <h5>Po ceni od ${lease.value.cena} dinara za period ${new Date(lease.value.odDatuma).toLocaleDateString()} - ${new Date(lease.value.doDatuma).toLocaleDateString()}</h5>
                  <br/>
                  <br/>
                  <h4>Kontakt:</h4>
                  <label>email: ${ lease.value.korisnikPozajmljuje.email }</label><br/>
                  <label>telefon: ${ lease.value.korisnikPozajmljuje.telefon }</label>`);

            await session.commitTransaction();
            await session.endSession();
            return res.send({ poruka: "Uspesno!", sadrzaj: {} });
        } catch (sadrzaj) {
            console.log(sadrzaj);
            await session.abortTransaction();
            await session.endSession();
            res.status(501).send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj });
        }
    } catch (sadrzaj) {
        console.log(sadrzaj);
        return res.status(501).send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj });
    }
});

router.delete('/:userID/:bookID', async(req, res) => {
    try {
        LeaseModel.deleteOne({ korisnikPozajmljuje: req.params.userID, knjiga: req.params.bookID, potvrdjeno: 0 })
            .then(result =>
                result.deletedCount != 1 ?
                res.status(409).send({ poruka: "Nastala je greska!", sadrzaj: "Nije pronadjen zahtev! " }) :
                res.send({ poruka: "Uspesno!", sadrzaj: {} }))
            .catch(sadrzaj => res.status(409).send({ poruka: "Nastala je greska!", sadrzaj }));
    } catch (sadrzaj) {
        console.log(sadrzaj);
        return res.status(501).send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj });
    }
});

module.exports = router;