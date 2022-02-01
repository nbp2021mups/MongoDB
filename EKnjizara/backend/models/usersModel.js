const mongoose = require("mongoose");

const schema = mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Provided username is already taken!"],
        required: [true, "Usename is required!"],
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
    },
    firstName: {
        type: String,
        required: [true, "First name is required!"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required!"],
    },
    contact: {
        email: {
            type: String,
            required: [true, "Email address is required!"],
            match: [/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/, "Wrong email address format!"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required!"],
            match: [/\+[1-9]{1,3}[0-9]{8,10}/, "Wrong phone number format!"],
        },
    },
    cart: {
        price: {
            type: Number,
            min: [0, "Price cannot be a negative value!"],
            default: 0,
        },
        productsNo: {
            type: Number,
            min: [0, "Number of products in the cart cannot be a negative value!"],
            default: 0,
        },
        products: {
            type: [String],
        },
    },
});

const UserModel = mongoose.model("user", schema);

module.exports = { UserModel };
