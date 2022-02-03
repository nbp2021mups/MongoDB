const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    isbn: {
        type: String,
        index: true,
        unique: [true, "ISBN must be a unique value!"],
        required: [true, "ISBN is required!"],
    },
    title: {
        type: String,
        required: [true, "Book title is required!"],
        index: true,
    },
    author: {
        type: String,
        required: [true, "Author info is required!"],
        index: true,
    },
    genre: {
        type: [String],
        minlength: [1, "Book must have at least one genre!"],
        index: true,
    },
    stockNo: {
        type: Number,
        required: [true, "Stock number is required!"],
        min: [0, "Stock number cannot be a negative value!"],
    },
    published: {
        type: Date,
        index: true,
    },
    price: {
        type: Number,
        required: [true, "Price tag is required!"],
    },
    description: {
        type: String,
    },
    format: {
        type: String,
        match: [/[0-9][1-9]+[Xx][0-9][1-9]+\w{2,5}/, "Book format is invalid!"],
    },
    pagesNo: {
        type: Number,
    },
    tags: {
        type: [String],
        default: [],
    },
    image: {
        type: String,
        required: [true, "Image is required!"],
    },
});

const BookModel = mongoose.model("book", schema);

module.exports = { BookModel };
