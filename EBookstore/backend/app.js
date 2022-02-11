const express = require("express");
const path = require("path");

const authRoute = require("./routes/auth");
const booksRoute = require("./routes/books");
const companiesRoute = require("./routes/companies");
const productsRoute = require("./routes/products");
const usersRoute = require("./routes/users");
const ordersRoute = require("./routes/orders");
const leasesRoute = require("./routes/leases");
const urosRoute = require("./routes/uros");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.use("/auth", authRoute);
app.use("/books", booksRoute);
app.use("/companies", companiesRoute);
app.use("/products", productsRoute);
app.use("/users", usersRoute);
app.use("/orders", ordersRoute);
app.use("/leases", leasesRoute);
app.use("/uros", urosRoute);

module.exports = app;
