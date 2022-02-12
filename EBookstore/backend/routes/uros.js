const express = require("express");
const router = express.Router();

const { ProductModel } = require("../models/productsModel");
const { CompanyModel } = require("../models/companiesModel");
const { LeaseModel } = require("../models/leasesModel");

router.get("/search/:idKnjizare/:skip/:count", async(req, res) => {
    try {
        let filter = {};

        //opsti filteri
        if (req.query.kategorija) {
            filter['kategorija'] = req.query.kategorija;
        }
        if (req.query.naziv) {
            filter['naziv'] = { $regex: req.query.naziv };
        }
        if (req.query.proizvodjac) {
            filter['proizvodjac'] = { $regex: req.query.proizvodjac };
        }
        if (req.query.cene) {
            const cene = JSON.parse(req.query.cene);
            const nizCena = [];

            cene.forEach(c => {
                cenaV = c.split("-");
                nizCena.push({ cena: { $gte: parseInt(cenaV[0]), $lte: parseInt(cenaV[1]) } });
            });
            filter.$or = nizCena;
        }

        //ukoliko je izabrana kategorija 'knjige' imamo dodatne filtere
        if (req.query.kategorija && req.query.kategorija == 'knjiga') {
            if (req.query.autor) {
                filter['autor'] = { $regex: req.query.autor };
            }
            if (req.query.zanr) {
                filter['zanr'] = { $in: JSON.parse(req.query.zanr) }
            }
            //ukoliko je izabrana kategorija 'drustvena-igra'
        } else if (req.query.kategorija && req.query.kategorija == 'drustvena igra') {
            if (req.query.uzrast) {
                const uzrasti = JSON.parse(req.query.uzrast);
                const nizUzrasta = [];

                uzrasti.forEach(u => {
                    u = u.split("-");
                    nizUzrasta.push({ uzrastOd: { $gte: parseInt(u[0]) }, uzrastDo: { $lte: parseInt(u[1]) } });
                });
                filter.$or = nizUzrasta;
            }
            //ukoliko je izabrana 'slagalica'
        } else if (req.query.kategorija && req.query.kategorija == 'slagalica') {
            if (req.query.brDelova) {
                filter['brojDelova'] = { $in: JSON.parse(req.query.brDelova) };
            }
            //ukoliko je izabran ranac
        } else if (req.query.kategorija && req.query.kategorija == 'ranac') {
            if (req.query.pol) {
                filter['pol'] = { $in: JSON.parse(req.query.pol) };
            }
            //ukoliko je izabrana sveska
        } else if (req.query.kategorija && req.query.kategorija == 'sveska') {
            if (req.query.format) {
                filter['format'] = { $in: JSON.parse(req.query.format) };
            }
        } else if (req.query.kategorija && req.query.kategorija == 'privezak') {
            if (req.query.materijal) {
                filter['materijal'] = { $regex: req.query.materijal };
            }
        }

        const company = await CompanyModel.findById(req.params.idKnjizare).populate({
            path: 'ponudjeniProizvodi',
            match: filter,
            select: req.query.selectFields,
            limit: req.params.count,
            skip: req.params.skip,
            options: { sort: req.query.sort ? req.query.sort : null }
        }).select('ponudjeniProizvodi').exec();

        return res.send(company);
    } catch (err) {
        console.log(err);
        return res.status(501).send("Doslo je do greske!");
    }
});




router.get("/search/:skip/:count", async(req, res) => {
    try {
        let filter = {};

        //opsti filteri
        if (req.query.kategorija) {
            filter['kategorija'] = req.query.kategorija;
        }
        if (req.query.naziv) {
            filter['naziv'] = { $regex: req.query.naziv };
        }
        if (req.query.proizvodjac) {
            filter['proizvodjac'] = { $regex: req.query.proizvodjac };
        }
        if (req.query.cene) {
            const cene = JSON.parse(req.query.cene);
            const nizCena = [];

            cene.forEach(c => {
                cenaV = c.split("-");
                nizCena.push({ cena: { $gte: parseInt(cenaV[0]), $lte: parseInt(cenaV[1]) } });
            });
            filter.$or = nizCena;
        }

        //ukoliko je izabrana kategorija 'knjige' imamo dodatne filtere
        if (req.query.kategorija && req.query.kategorija == 'knjiga') {
            if (req.query.autor) {
                filter['autor'] = { $regex: req.query.autor };
            }
            if (req.query.zanr) {
                filter['zanr'] = { $in: JSON.parse(req.query.zanr) }
            }
            //ukoliko je izabrana kategorija 'drustvena-igra'
        } else if (req.query.kategorija && req.query.kategorija == 'drustvena igra') {
            if (req.query.uzrast) {
                const uzrasti = JSON.parse(req.query.uzrast);
                const nizUzrasta = [];

                uzrasti.forEach(u => {
                    u = u.split("-");
                    nizUzrasta.push({ uzrastOd: { $gte: parseInt(u[0]) }, uzrastDo: { $lte: parseInt(u[1]) } });
                });
                filter.$or = nizUzrasta;
            }
            //ukoliko je izabrana 'slagalica'
        } else if (req.query.kategorija && req.query.kategorija == 'slagalica') {
            if (req.query.brDelova) {
                filter['brojDelova'] = { $in: JSON.parse(req.query.brDelova) };
            }
            //ukoliko je izabran ranac
        } else if (req.query.kategorija && req.query.kategorija == 'ranac') {
            if (req.query.pol) {
                filter['pol'] = { $in: JSON.parse(req.query.pol) };
            }
            //ukoliko je izabrana sveska
        } else if (req.query.kategorija && req.query.kategorija == 'sveska') {
            if (req.query.format) {
                filter['format'] = { $in: JSON.parse(req.query.format) };
            }
        } else if (req.query.kategorija && req.query.kategorija == 'privezak') {
            if (req.query.materijal) {
                filter['materijal'] = { $regex: req.query.materijal };
            }
        }

        const products = await ProductModel.find(filter).select(req.query.selectFields)
            .skip(parseInt(req.params.skip))
            .limit(parseInt(req.params.count))
            .sort(req.query.sort ? req.query.sort : null)
            .exec();


        if (req.query.kategorija && req.query.kategorija == 'knjiga na izdavanje') {
            if (req.query.uid) {
                const leased = (await LeaseModel.find({ "korisnikPozajmljuje.id": req.query.uid }).select('knjiga')).reduce((acc, el) => ({...acc, [String(el.knjiga.id)]: true }), {});
                products.forEach(prod => prod._doc.zahtevana = leased[String(prod._id)]);
            }
        }

        return res.send(products);
    } catch (err) {
        console.log(err);
        return res.status(501).send("Doslo je do greske!");
    }
});



module.exports = router;
