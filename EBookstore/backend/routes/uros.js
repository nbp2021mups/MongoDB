const express = require("express");
const router = express.Router();

const { ProductModel } = require("../models/productsModel");
const { CompanyModel } = require("../models/companiesModel");

router.get("/search/:idKnjizare/:skip/:count", async (req, res) => {
    try{
        let filter = {};

        if(req.query.kategorija) {
            filter['kategorija'] = req.query.kategorija;
        }
        if(req.query.naziv) {
            filter['naziv'] = req.query.naziv;
        }
        if(req.query.proizvodjac) {
            filter['proizvodjac'] = req.query.proizvodjac;
        }
        if(req.query.cene) {
            let minCena = 999999; let maxCena = 0;
            const cene = JSON.parse(req.query.cene);
            cene.forEach(cena => {
                cena = cena.split("-");
                if(cena[0] < minCena){
                    minCena = cena[0];
                }
                if(cena[1] != '' && cena[1] > maxCena) {
                    maxCena = cena[1];
                }
            });
            filter['cena'] = {$gte : minCena, $lte: maxCena};
        }

        //sutra dodaj ostale i dodaj regex
        console.log(filter);


        const company = await CompanyModel.findById(req.params.idKnjizare).populate({path : 'ponudjeniProizvodi',
            match: filter,
            select: req.query.selectFields,
            limit: req.params.count,
            skip: req.params.skip,
            options : {sort: req.query.sort ? req.query.sort : null}
        }).select('ponudjeniProizvodi').exec();

        return res.send(company);
    }
    catch(err){
        console.log(err);
        return res.status(501).send("Doslo je do greske!");
    }
});

module.exports = router;
