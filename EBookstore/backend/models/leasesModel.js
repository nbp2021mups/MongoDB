const mongoose = require("mongoose");
const { isEmail } = require("validator");

const schema = mongoose.Schema({
    // Korisnik koji daje u zajam
    korisnikZajmi: {
        _id: { id: false },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "Obavezno je navesti identifikator korisnika koji daje na zajam!"],
            index: true
        },
        ime: {
            type: String,
            required: [true, "Obavezno je navesti ime korisnika koji daje na zajam!"],
        },
        prezime: {
            type: String,
            required: [true, "Obavezno je navesti prezime korisnika koji daje na zajam!"],
        },
        adresa: {
            type: String,
            required: [true, "Obavezno je navesti adresu korisnika koji daje na zajam!"],
        },
        email: {
            type: String,
            required: [true, "Obavezno je navesti email korisnika koji daje na zajam!"],
            validate: [isEmail, "Pogresan format email adrese!"]
        },
        telefon: {
            type: String,
            required: [true, "Obavezno je navesti telefon korisnika koji daje na zajam!"],
            match: [/\+[1-9]{1,3}[0-9]{8,10}/, "Pogresan format broja telefona!"]
        },
    },
    // Korisnik koji uzima na zajam
    korisnikPozajmljuje: {
        _id: { id: false },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "Obavezno je navesti identifikator korisnika koji pozajmljuje!"],
            index: true
        },
        ime: {
            type: String,
            required: [true, "Obavezno je navesti ime korisnika koji pozajmljuje!"],
        },
        prezime: {
            type: String,
            required: [true, "Obavezno je navesti prezime korisnika koji pozajmljuje!"],
        },
        adresa: {
            type: String,
            required: [true, "Obavezno je navesti adresu korisnika koji pozajmljuje!"],
        },
        email: {
            type: String,
            required: [true, "Obavezno je navesti email korisnika koji pozajmljuje!"],
            validate: [isEmail, "Pogresan format email adrese!"]
        },
        telefon: {
            type: String,
            required: [true, "Obavezno je navesti telefon korisnika koji pozajmljuje!"],
            match: [/\+[1-9]{1,3}[0-9]{8,10}/, "Pogresan format broja telefona!"]
        },
    },
    knjiga: {
        _id: { id: false },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: [true, "Obavezno je navesti identifikator knjige koja se pozajmljuje!"],
            index: true
        },
        naziv: {
            type: String,
            required: [true, "Naziv proizvoda je obavezan!"],
        },
        proizvodjac: {
            type: String,
            required: [true, "Proizvodjac je obavezan!"],
        },
        slika: {
            type: String,
            required: [true, "Neophodno je navesti sliku!"]
        },
        autor: {
            type: String,
            required: [true, "Autor je obavezan!"],
        },
        cena: {
            type: Number,
            required: [true, "Cena mora biti navedena!"],
            min: [0, "Cena ne sme biti negativna vrednost!"],
        },
        zanr: {
            type: [String],
            minlength: [1, "Knjiga mora imati barem jedan zanr!"],
            enum: [
                "Drama",
                "Komedija",
                "Triler",
                "Naucna fantastika",
                "Psihologija",
                "Strucna literatura",
                "Zdravlje",
                "Knjige za decu",
                "Roman",
                "Klasik",
                "Novela",
                "Horor"
            ],
        },
    },
    cena: {
        type: Number,
        required: [true, "Morate navesti cenu zajama!"]
    },
    odDatuma: {
        type: Date,
        required: [true, "Obavezno je navesti od kog datuma je izdavanje!"]
    },
    doDatuma: {
        type: Date,
        required: [true, "Obavezno je navesti do kog datuma je izdavanje!"],
        expires: 0
    },
    potvrdjeno: {
        type: Number,
        default: 0
    }
});

schema.index({ "korisnikPozajmljuje.id": 1, "knjiga.id": 1, "korisnikZajmi.id": 1 });

const LeaseModel = mongoose.model("lease", schema);

module.exports = { LeaseModel };
