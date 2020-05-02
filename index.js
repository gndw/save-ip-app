const express = require('express');
const PORT = process.env.PORT || 5000;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/test?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const app = express();
app.get('/', (req, res) => res.send('OK'));

app.get('/submit', (req, res) => {
    
    const collection = mongoClient.db("general").collection("listing");
    const time = new Date(Date.now());
    
    collection.insertOne(
        { 
            headers: req.headers,
            time:time.toString(),
            utcTime:time.toUTCString(),
            idTime:time.toLocaleString('id')
        },
        (err, result) => {
            if (err) {
                console.log("Failed to write to DB");
                console.error(err);
                res.status(500);
            } else {
                res.send('OK');
            }
        });

});

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
    mongoClient.connect(err => {

        if (err) {
            console.log("Failed to connect to database...");
            console.error(err);
        } else {
            console.log('Database connected...');
        }

    });

});
