// Load all environment variables from env file
require('dotenv').config();
// To use express library
const express = require('express');
// Create app variable to configure server
const app = express();
// To use mongoose library
const mongoose = require('mongoose');
// Require the spotify web api library
const SpotifyWebApi = require('spotify-web-api-node');
// Require querystring library
const querystring = require('querystring');
// Require cookieparser library
const cookieParser = require('cookie-parser');
// Require request library
const request = require('request');




/*CONNECTION TO MY MONGODB DATABASE*/ 
mongoose.connect(process.env.URL);
const db = mongoose.connection;
//Log error if connection fails
db.on('error', (error) => console.error(error));
// Conseole log a succesfull connection to DB
db.once('open', () => console.log('Succesfully connected to Database'));

// Accept JSON as a body instead of POST element
app.use(express.json());




/*LOGIN OF SPOTIFY*/ 

// Authorization i'm asking the spotify api



app.listen(8888, () =>
  console.log(
    'HTTP Server up. Now go to http://localhost:8888/login in your browser.'
  )
);