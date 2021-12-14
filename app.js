// Load all environment variables from env file
require('dotenv').config();
// To use express library
const express = require('express');
const mongoose = require('mongoose');

// Create app variable to configure server
const app = express();

/*CONNECTION TO MY MONGODB DATABASE*/
mongoose.connect(process.env.URL);
const db = mongoose.connection;
//Log error if connection fails
db.on('error', (error) => console.error(error));
// Conseole log a succesfull connection to DB
db.once('open', () => console.log('Succesfully connected to Database'));

// Accept JSON as a body instead of POST element
app.use(express.json());

app.get("/", function (req, res) {
  res.send("Working perfectly ilyes");
})

app.listen(8888, () =>
  console.log(
    'HTTP Server up.'
  )
);