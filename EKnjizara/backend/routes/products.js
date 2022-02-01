const express = require("express");
const router = express.Router();

const { ProductModel } = require("../models/productsModel");

router.get("/search", async(req, res) => {
    try {
        ProductModel.find(JSON.parse(req.query.filter))
            .select(req.query.select)
            .skip(req.query.skip)
            .limit(req.query.count)
            .then((result) => {
                console.log(result);
                res.send({ msg: "Success!", content: result });
            });
    } catch (ex) {
        console.log(ex);
        return res.status(409).send({ msg: "Error occurred!", content: ex });
    }
});

router.post("/", async(req, res) => {
    try {
        new ProductModel(req.body).save().then((response) => {
            return res.send({ msg: "Success!", content: response });
        });
    } catch (ex) {
        console.log(ex);
        return res.status(409).send({ msg: "Error occurred!", content: ex });
    }
});

router.put("/", async(req, res) => {
    try {
        ProductModel.updateOne(req.body.filter, req.body.update).then(
            (response) => {
                return res.send({ msg: "Success!", content: response });
            }
        );
    } catch (ex) {
        console.log(ex);
        return res.status(409).send({ msg: "Error occurred!", content: ex });
    }
});

router.delete("/", async(req, res) => {
    try {
        ProductModel.deleteOne(JSON.parse(req.query.filter)).then((response) => {
            return res.send({ msg: "Success!", content: response });
        });
    } catch (ex) {
        console.log(ex);
        return res.status(409).send({ msg: "Error occurred!", content: ex });
    }
});

module.exports = router;
