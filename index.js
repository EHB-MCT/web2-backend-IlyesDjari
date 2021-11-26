// Load all environment variables from env file
require('dotenv').config();

// To use express library
const express = require('express');
const req = require('express/lib/request');
// Create app variable to configure server
const app = express();
// To use mongoose library
const mongoose = require('mongoose')


mongoose.connect(process.env.URL);
const db = mongoose.connection;

//Log error if connection fails
db.on('error', (error) => console.error(error));

// Conseole log a succesfull connection to DB
db.once('open', () => console.log('Succesfully connected to Database'));








app.get('/', (req, res) => {
res.send('Hello Ilyes i <3');
});

app.get('/OTO', (req, res) => {
    res.send(["damso", "hamza", "booba"]);
    });

app.get('/OTO/:ID', (req, res) => {
    res.send(req.params.ID);
    });

// Preparing for hosting environment, support of dynamic port, if none => use 3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));