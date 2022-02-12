const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    naziv: {
        type: String,
        required: [true, "Naziv proizvoda je obavezan!"],
        index: true,
    },
    // Izdavac/proizvodjac
    proizvodjac: {
        type: String,
        required: [true, "Proizvodjac je obavezan!"],
        index: true
    },
    kolicina: {
        type: Number,
        required: [true, "Obavezno je navesti kolicinu!"],
        min: [0, "Kolicina ne sme biti negativna vrednost!"],
    },
    cena: {
        type: Number,
        required: [true, "Cena mora biti navedena!"],
        min: [0, "Cena ne sme biti negativna vrednost!"]
    },
    slika: {
        type: String,
        default: "template.jpg",
    },
    kategorija: {
        type: String,
        required: [true, "Kategorija proizvoda je obavezna!"],
        enum: [
            "knjiga",
            "knjiga na izdavanje",
            "ranac",
            "sveska",
            "slagalica",
            "drustvena igra",
            "privezak",
        ],
    },
    opis: {
        type: String,
        required: [true, "Opis je obavezan!"]
    },
    poreklo: {
        _id: { id: false },
        ime: String,
        prezime: String,
        naziv: String,
        id: {
            type: mongoose.Types.ObjectId,
            required: [true, "ID je obavezno polje!"],
            index: true
        },
    }
}, { strict: false });

schema.index({ "autor": 1 });

const ProductModel = mongoose.model("product", schema);

module.exports = { ProductModel };
