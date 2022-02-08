const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    isbn: {
        type: String,
        index: true,
        unique: [true, "ISBN mora biti jedinstven!"],
        required: [true, "ISBN je obavezan!"],
    },
    autor: {
        type: String,
        required: [true, "Autor je obavezan!"],
        index: true,
    },
    zanr: {
        type: [String],
        minlength: [1, "Knjiga mora imati barem jedan zanr!"],
        index: true,
        enum: [
            "Drama",
            "Komedija",
            "Triler",
            "Naucna fantastika",
            "Psihologija",
            "Stucna literatura",
            "Zdravlje",
            "Knjige za decu",
            "Roman",
            "Klasik",
            "Novela"
        ],
    },
    izdata: {
        type: Date,
        index: true,
    },
    brojStrana: {
        type: Number,
    },
    /* tagovi: {
        type: [String],
        default: [],
    }, */
});

const BookModel = mongoose.model("book", schema);

module.exports = { BookModel };
