const mongoose = require("mongoose");
const { isEmail } = require("validator");

const schema = mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username mora biti jedinstven!"],
        required: [true, "Username je obavezan!"],
        index: [true, "Username mora biti jedinstven!"],
    },
    lozinka: {
        type: String,
        required: [true, "Lozinka je obavezna!"],
    },
    ime: {
        type: String,
        required: [true, "Ime je obavezno!"],
    },
    prezime: {
        type: String,
        required: [true, "Prezime je obavezno!"],
    },
    adresa: {
        type: String,
        required: [true, "Adresa je obavezna!"],
    },
    email: {
        type: String,
        required: [true, "Email adresa je obavezna!"],
        unique: [true, "Email adresa mora biti jedinstvena!"],
        validate: [isEmail, "Pogresan format email adrese!"],
        index: true,
    },
    telefon: {
        type: String,
        required: [true, "Broj telefona je obavezan!"],
        unique: [true, "Broj telefona mora biti jedinstven!"],
        match: [/\+[1-9]{1,3}[0-9]{8,10}/, "Pogresan format broja telefona!"],
        index: true,
    },
    korpa: {
        _id: { id: false },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "carts",
            required: [true, "ID korpe je obavezan!"]
        },
        cena: {
            type: Number,
            min: [0, "Cena ne moze biti negativna vrednost!"],
            default: 0,
        },
        brojProizvoda: {
            type: Number,
            min: [0, "Broj proizvoda ne moze da bude negativna vrednost!"],
            default: 0,
        },
    },
    narudzbine: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders"
    }],
    iznajmljuje: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "product"
    }]
});

const UserModel = mongoose.model("user", schema);

module.exports = { UserModel };
