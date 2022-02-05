const mongoose = require("mongoose");
const { isEmail } = require("validator");

const schema = new mongoose.Schema({
    pib: {
        type: String,
        unique: [true, "PIB mora biti jedinstven!"],
        required: [true, "PIB je obavezan!"],
    },
    username: {
        type: String,
        unique: [true, "Username mora biti jedinstven!"],
        required: [true, "Username je obavezan!"],
    },
    lozinka: {
        type: String,
        required: [true, "Lozinka je obavezna!"],
    },
    naziv: {
        type: String,
        required: [true, "Naziv je obavezan!"],
    },
    email: {
        type: String,
        required: [true, "Email adresa je obavezna!"],
        unique: [true, "Email adresa mora biti jedinstvena!"],
        validate: [isEmail, "Pogresan format email adrese!"],
    },
    telefon: {
        type: String,
        required: [true, "Broj telefona je obavezan!"],
        unique: [true, "Broj telefona mora biti jedinstven!"],
        match: [/\+[1-9]{1,3}[0-9]{8,10}/, "Pogresan format broja telefona!"],
    },
    ponudjeniProizvodi: {
        type: [mongoose.Types.ObjectId],
    },
});

const CompanyModel = mongoose.model("company", schema);

module.exports = { CompanyModel };
