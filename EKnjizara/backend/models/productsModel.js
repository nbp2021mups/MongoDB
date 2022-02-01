const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    barcode: {
        type: String,
        match: [/[0-9]{13}/, "Wrong barcode format!"],
        unique: [true, "Barcode must be unique for each product!"],
        required: [true, "Barcode is required!"],
        index: true,
    },
    name: {
        type: String,
        required: [true, "Name of the product is required!"],
        index: true,
    },
    stockNo: {
        type: Number,
        required: [true, "Number of products in stock is required!"],
        min: [0, "Number of products in stock cannot be a negative number!"],
    },
    price: {
        type: Number,
        required: [true, "Price tag is required!"],
    },
    image: {
        type: String,
        default: "template.jpg",
    },
    category: {
        type: String,
        required: [true, "Product category is required!"],
        enum: [
            "books",
            "backpacks",
            "writing utencils",
            "drawing utencils",
            "other",
        ],
    },
});

const ProductModel = mongoose.model("product", schema);

module.exports = { ProductModel };
