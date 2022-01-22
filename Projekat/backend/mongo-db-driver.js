require('dotenv');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const getClient = async() => {
    if (!client.connected) {
        await client.connect();
        // await client.db('admin').command({ ping: 1 });
        client.connected = true;
    }
    return client;
};

module.exports = { getClient };