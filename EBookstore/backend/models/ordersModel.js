const mongoose = require("mongoose");
const { stringify } = require("querystring");

const schema = mongoose.Schema({
    kompanija: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companies",
        default: null
    },
    korisnik: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "Mora se navesti ID korisnika!"],
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
            ref: "products",
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
                ref: "companies",
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
    potvrdjena: {
        _id: { id: false },
        vrednost: {
            type: Boolean,
            default: false
        },
        od: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "companies",
        }],
        ukupno: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "companies",
        }]
    },
    datum: {
        type: Date,
        default: new Date()
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