const express = require('express');
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();



const app = express();
const port = process.env.PORT || 5000;


// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oteh7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db("travelX");
        const packageCollection = database.collection("packages");
        const orderCollection = database.collection("orders");

        // GET API 
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

        // POST API 
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;

            const result = await orderCollection.insertOne(newOrder);
            console.log('added new user: ', result);
            res.send(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('travelX server running');
});

app.listen(port, () => {
    console.log('listening from port', port);
});
