const mongoose = require("mongoose");

const schema = mongoose.Schema({
    cena: {
        type: Number,
        min: [0, "Cena narudzbine ne moze biti validna!"],
        default: 0,
    },
    brojProizvoda: {
        type: Number,
        min: [0, "Broj proizvoda ne moze biti negativna vrednost!"],
        default: 0,
    },
    proizvodi: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
    }, ],
    korisnik: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
});

const OrderModel = mongoose.model("order", schema);

module.exports = { OrderModel };
