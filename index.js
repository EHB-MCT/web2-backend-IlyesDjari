// Load all environment variables from env file
require('dotenv').config();
const fs = require('fs/promises');
const bodyParser = require('body-parser');
// To use express library
const express = require('express');
const mongoose = require('mongoose');

// Create app variable to configure server
const app = express();
const PORT = process.env.PORT || 8888;
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


app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "../web2-frontend-IlyesDjari/src/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});


app.use(express.static('public'));

app.listen(PORT, () =>
  console.log(
    'HTTP Server up.'
  )
);