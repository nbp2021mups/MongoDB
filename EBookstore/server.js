require("dotenv").config();
const mongoose = require("mongoose");
const http = require("http");
const app = require("./backend/app");

const hostname = process.env.SERVER_HOSTNAME;
const port = process.env.SERVER_PORT;

const server = http.createServer(app);

server.listen({
        host: hostname,
        port: port,
    },
    () => {
        console.log(`Server listening on port http://${hostname}:${port}`);
        mongoose.connect(process.env.MONGO_DB_URI, (error) => {
            if (!error) console.log("Successfully connected to mongoDB!");
            else console.log("Error connecting to mongoDB", error);
        });
    }
);
