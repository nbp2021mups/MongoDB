const express = require('express');
const router = express.Router();
const mongoDBClient = require('./../mongo-db-driver.js');

router.get('/', async(req, res) => {
    try {
        (await mongoDBClient.getClient()).db('proba').collection('proba').insertOne({ proba: 'proba' });
        return res.send({ msg: 'OK', content: {} });
    } catch (ex) {
        console.log(ex);
        return res.status(409).send({ msg: 'Došlo je do greške', content: {} });
    }
});

router.post('/', async(req, res) => {
    try {
        return res.send({ msg: 'OK', content: {} });
    } catch (ex) {
        console.log(ex);
        return res.status(409).send({ msg: 'Došlo je do greške', content: {} });
    }
});

router.put('/', async(req, res) => {
    try {
        return res.send({ msg: 'OK', content: {} });
    } catch (ex) {
        console.log(ex);
        return res.status(409).send({ msg: 'Došlo je do greške', content: {} });
    }
});

router.patch('/', async(req, res) => {
    try {
        return res.send({ msg: 'OK', content: {} });
    } catch (ex) {
        console.log(ex);
        return res.status(409).send({ msg: 'Došlo je do greške', content: {} });
    }
});

router.delete('/', async(req, res) => {
    try {
        return res.send({ msg: 'OK', content: {} });
    } catch (ex) {
        console.log(ex);
        return res.status(409).send({ msg: 'Došlo je do greške', content: {} });
    }
});

module.exports = router;