// Load all environment variables from env file
require('dotenv').config();
const fs = require('fs/promises');
const bodyParser = require('body-parser');
// To use express library
const express = require('express');
const mongoose = require('mongoose');

// Create app variable to configure server
const app = express();
const port = process.env.PORT;
const URL = process.env.URL;

/*CONNECTION TO MY MONGODB DATABASE*/
mongoose.connect(URL);
const db = mongoose.connection;
//Log error if connection fails
db.on('error', (error) => console.error(error));
// Conseole log a succesfull connection to DB
db.once('open', () => console.log('Succesfully connected to Database'));


// Accept JSON as a body instead of POST element
app.use(bodyParser.json());


/*app.get("/", function (req, res) {
  res.send("Working perfectly ilyes");
})*/

app.use(express.static('public'));

app.listen(8888, () =>
  console.log(
    'HTTP Server up.'
  )
);