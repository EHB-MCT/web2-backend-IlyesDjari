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


app.get("/", function (req, res) {
  let html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Oto Public</title>
  </head>
  <body>
      <h1>Hello Ilyes</h1>
      <p>Web 2 is soooooo fun</p>
  </body>
  </html>`
  res.send(html);
})

app.use(express.static('public'));

console.log(PORT);

app.listen(PORT, () =>
  console.log(
    'HTTP Server up.'
  )
);