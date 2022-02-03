const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    pib: {
        type: String,
        unique: [true, "PIB must be unique!"],
        required: [true, "PIB is required!"],
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
    },
    name: {
        type: String,
        required: [true, "Name is required!"],
    },
    offeredProducts: {
        type: [mongoose.Types.ObjectId],
    },
});

const CompanyModel = mongoose.model("company", schema);

module.exports = { CompanyModel };
