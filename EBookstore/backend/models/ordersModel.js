const mongoose = require("mongoose");
const { stringify } = require("querystring");

const schema = mongoose.Schema({
    kompanija: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company",
        index: true
    },
    korisnik: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Mora se navesti ID korisnika!"],
        index: true
    },
    cena: {
        type: Number,
        min: [0, "Cena ne moze biti negativna vrednost!"],
        required: [true, "Mora se navesti cena narudzbine!"]
    },
    brojProizvoda: {
        type: Number,
        min: [0, "Broj proizvoda ne moze da bude negativna vrednost!"],
        required: [true, "Mora se navesti broj proizvoda!"]
    },
    proizvodi: [{
        _id: { id: false },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: [true, "Mora se navesti ID proizvoda!"],
        },
        naziv: {
            type: String,
            required: [true, "Naziv proizvoda je obavezan!"],
        },
        cena: {
            type: Number,
            required: [true, "Cena mora biti navedena!"],
            min: [0, "Cena ne sme biti negativna vrednost!"],
        },
        slika: {
            type: String,
            required: [true, "Mora da se navede slika proizvoda!"]
        },
        kolicina: {
            type: Number,
            required: [true, "Kolicina mora biti navedena!"],
            min: [1, "Kolicina mora biti veca od 0!"],
        },
        proizvodjac: {
            type: String,
            required: [true, "Proizvodjac proizvoda je obavezan!"],
        },
        poreklo: {
            _id: { id: false },
            naziv: String,
            id: {
                type: mongoose.Types.ObjectId,
                ref: "company",
                required: [true, "ID je obavezno polje!"],
            },
        },
        kategorija: {
            type: String,
            required: [true, "Kategorija proizvoda je obavezna!"],
            enum: [
                "knjiga",
                "ranac",
                "sveska",
                "slagalica",
                "drustvena igra",
                "privezak",
            ],
        },
    }, ],
    status: {
        _id: { id: false },
        potvrdjena: {
            type: Number,
            default: 0
        },
        potvrdili: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "company",
        }],
        odbili: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "company",
        }],
        naCekanju: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "company",
        }],
        celaNarudzbina: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "order",
        }
    },
    datum: {
        type: Date,
        required: [true, "Neophodno je navesti datum narudzbine!"]
    },
    kategorija: {
        type: String,
        required: [true, "Morate navesti koje kategorije je narudzbina"],
        enum: [
            'kompanija',
            'korisnik'
        ]
    },
});

const OrderModel = mongoose.model("order", schema);

module.exports = { OrderModel };
