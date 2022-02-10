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
            .sort(req.query.field)
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
        ProductModel.find({ "poreklo.id": req.params.companyId })
            .select(req.query.select)
            .skip(req.query.skip)
            .limit(req.query.count)
            .sort(req.query.field)
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

router.get("/:productId", async(req, res) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        return res.send(product);
    } catch {
        console.log(ex);
        return res.status(501).send("Nastala je greska na serverskoj strani!");

    }
})


router.post("/", multer({ storage }).single("image"), async(req, res) => {
    try {
        const kategorija = req.body.kategorija;
        if (kategorija == 'knjiga') {
            if (req.body.brojStrana)
                req.body.brojStrana = parseInt(req.body.brojStrana);
            if (req.body.izdata)
                req.body.izdata = parseInt(req.body.izdata);
        } else if (kategorija == 'sveska') {
            if (req.body.brojListova)
                req.body.brojListova = parseInt(req.body.brojListova);
        } else if (kategorija == 'drustvena igra') {

            req.body.uzrastOd = parseInt(req.body.uzrastOd);
            req.body.uzrastDo = parseInt(req.body.uzrastDo);
            if (req.body.brojIgraca)
                req.body.brojIgraca = parseInt(req.body.brojIgraca);
            if (req.body.trajanje)
                req.body.trajanje = parseInt(req.body.trajanje);
        } else if (kategorija == 'slagalica') {
            req.body.brojDelova = parseInt(req.body.brojDelova);
        }


        req.body.poreklo = JSON.parse(req.body.poreklo);
        if (!req.body.poreklo ||
            !req.body.poreklo.id ||
            (!req.body.poreklo.naziv && (!req.body.poreklo.ime || !req.body.poreklo.prezime)) ||
            (req.body.poreklo.ime && req.body.poreklo.prezime && req.body.poreklo.naziv)) {
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
            else if (req.body.kategorija == "knjiga na izdavanje")
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

router.patch("/:productId", multer({ storage }).single("image"), async(req, res) => {
    try {
        const newValues = JSON.parse(req.body.newValues);
        if (req.file) {
            const url = req.protocol + "://" + req.get("host");
            let imgPath = url + "/images/" + req.file.filename;
            newValues.slika = imgPath;
        }
        console.log(newValues)
        await ProductModel.findByIdAndUpdate(req.params.productId, newValues);
        if (req.body.oldImg) {
            const path = "./backend" + req.body.oldImg.substring(req.body.oldImg.indexOf("/images"));

            fs.unlink(path, (err) => {
                if (err)
                    console.log(err);
            });

        }
        return res.send("Proizvod je uspešno ažiriran.")

    } catch (ex) {
        console.log(ex);
        return res.status(501).send("Došlo je do greške prilikom izmene proizvoda, pokušajte ponovo.");
    }

})

router.delete('/:productId/company/:idPorekla', async(req, res) => {
    try {
        await ProductModel.findByIdAndDelete(req.params.productId);
        await CompanyModel.findByIdAndUpdate(req.params.idPorekla, { $pull: { ponudjeniProizvodi: req.params.productId } });
        const path = "./backend" + req.body.imagePath.substring(req.body.imagePath.indexOf("/images"));

        fs.unlink(path, (err) => {
            if (err)
                console.log(err);
        });
        return res.send("Uspesno obrisan proizvod");

    } catch (ex) {
        console.log(ex);
        return res.status(501).send("Doslo je do greske prilikom brisanja proizvoda, pokusajte ponovo!");
    }

})

router.delete('/:productId/user/:idPorekla', async(req, res) => {
    try {
        await ProductModel.findByIdAndDelete(req.params.productId);
        await UserModel.findByIdAndUpdate(req.params.idPorekla, { $pull: { ponudjeneKnjige: req.params.productId } });
        const path = "./backend" + req.body.imagePath.substring(req.body.imagePath.indexOf("/images"));

        fs.unlink(path, (err) => {
            if (err)
                console.log(err);
        });
        return res.send("Uspesno obrisan proizvod");

    } catch (ex) {
        console.log(ex);
        return res.status(501).send("Doslo je do greske prilikom brisanja proizvoda, pokusajte ponovo!");
    }

})

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