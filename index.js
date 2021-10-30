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

        // GET API to load deals/packages
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

        // GET API to load orders
        app.get('/bookings', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        // POST API to place order
        app.post('/bookings', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.send(result);
        });

        // POST API to add new deal 
        app.post('/packages', async (req, res) => {
            const newPackage = req.body;
            const result = await packageCollection.insertOne(newPackage);
            // console.log(result);
            res.send(result);
        });

        //PUT API to Update order status
        app.put('/manageallorders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedOrder = req.body;
            const filter = { _id: ObjectId(id) };

            const updateDoc = {
                $set: {
                    status: updatedOrder.status
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // DELETE API to delete/cancel booking
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

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
