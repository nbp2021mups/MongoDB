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
        try {
            if (req.body.korisnikPozajmljuje == req.body.korisnikZajmi)
                throw "Ne mozete iznajmiti sopstveni proizvod!";

            const korisnici = await UserModel.find({ _id: { $in: [req.body.korisnikZajmi, req.body.korisnikPozajmljuje] } })
                .select('ime prezime adresa email telefon');

            if (korisnici.length != 2)
                throw "ID korisnika nisu validni!";

            if (new Date(req.body.odDatuma) > new Date(req.body.doDatuma) || new Date(req.body.odDatuma) < new Date())
                throw "Datumi nisu validni!";

            req.body.korisnikPozajmljuje = new mongoose.Types.ObjectId(req.body.korisnikPozajmljuje);
            req.body.korisnikZajmi = new mongoose.Types.ObjectId(req.body.korisnikZajmi);

            const knjiga = await ProductModel.findOne({ _id: req.body.knjiga }).select('naziv proizvodjac slika autor zanr cena');

            if (knjiga == null)
                throw "ID knjige nije validan!";

            const zajmi = korisnici.find(k => String(k._id) == String(req.body.korisnikZajmi)),
                pozajmljuje = korisnici.find(k => String(k._id) == String(req.body.korisnikPozajmljuje));

            const unique = await LeaseModel.findOne({ "korisnikPozajmljuje.id": req.body.korisnikPozajmljuje, "knjiga.id": req.body.knjiga, "korisnikZajmi.id": req.body.korisnikZajmi });
            if (unique.cena == req.body.cena && new Date(unique.odDatuma) == new Date(req.body.odDatuma) && new Date(req.body.doDatuma) == new Date(unique.doDatuma))
                throw "Već ste poslali identičan zahtev korisniku!";

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
                .save();

            return res.send({ poruka: "Uspesno!", sadrzaj: lease });

        } catch (sadrzaj) {
            console.log(sadrzaj);
            res.status(409).send({ poruka: "Nastala je greska!", sadrzaj });
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
                lease.value = await LeaseModel.findOneAndUpdate({ _id: req.body.leaseID }, { $set: { potvrdjeno: req.body.response } }, { new: true, session }).select('odDatuma doDatuma knjiga korisnikPozajmljuje');
                if (new Date(lease.value.odDatuma) < new Date())
                    throw "Period je istekao, ne možete prihvatiti!";

                lease.update = await ProductModel.findOneAndUpdate({ _id: lease.value.knjiga.id }, { $set: { izdataDo: lease.value.doDatuma } }, { session });

                if (!lease.update)
                    throw "Knjiga nije pronađena!";

                if (lease.update.izdataDo && new Date(lease.update.izdataDo) > new Date() && req.body.response == 1)
                    throw "Knjiga je već izdata!";

            } else if (req.body.response == -1)
                lease.value = await LeaseModel.findOneAndDelete({ _id: req.body.leaseID }, { new: true, session });
            else
                throw "Nevalidna vrednost odgovora!";

            if (!lease.value)
                throw "Nema zajma sa prosleđenim identifikatorom!"

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
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const lease = await LeaseModel.findOneAndDelete({ "korisnikPozajmljuje.id": req.params.userID, "knjiga.id": req.params.bookID }, { new: true, session }).select('potvrdjeno');

            if (!lease)
                throw "Nije pronađen zahtev!";

            if (lease.potvrdjeno == 1) {
                const p = await ProductModel.updateOne({ _id: req.params.bookID }, { $set: { izdataDo: new Date().toISOString() } }, { session });
                if (p.matchedCount != 1)
                    throw "Nije pronađen proizvod!";
            }

            await session.commitTransaction();
            await session.endSession();

            return res.send({ poruka: "Uspesno!", sadrzaj: {} });
        } catch (sadrzaj) {
            console.log(sadrzaj);
            await session.abortTransaction();
            await session.endSession();
            return res.status(501).send({ poruka: "Nastala je greska!", sadrzaj });
        }

    } catch (sadrzaj) {
        console.log(sadrzaj);
        return res.status(501).send({ poruka: "Nastala je greska na serverskoj strani!", sadrzaj });
    }
});

module.exports = router;
