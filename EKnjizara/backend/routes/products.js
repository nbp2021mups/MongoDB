const express = require("express");
const router = express.Router();

const { ProductModel } = require("../models/productsModel");

router.get("/search", (req, res) => {
    try {
        ProductModel.find(JSON.parse(req.query.filter))
            .select(req.query.select)
            .skip(req.query.skip)
            .limit(req.query.count)
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

router.post("/", (req, res) => {
    try {
        new ProductModel(req.body)
            .save()
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
