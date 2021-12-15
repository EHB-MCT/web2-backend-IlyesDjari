// Load all environment variables from env file
require('dotenv').config();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
var SpotifyWebApi = require('spotify-web-api-node');

// To use express library
const express = require('express');
const mongoose = require('mongoose');
// Create app variable to configure server
const app = express();
const PORT = process.env.PORT || 8888;

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYER = "https://api.spotify.com/v1/me/player";
const CURRENTLYPLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const PROFILE = "https://api.spotify.com/v1/me";
const CHOICES = [];


// Avoid any CORS error :'(
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});



app.get('/connect', function routeHandler(req, res, next) {

    var scopes = ['user-read-private', 'user-read-email'],
    redirectUri = 'http://127.0.0.1:5500/web2-frontend-IlyesDjari/docs/pages/home.html',
    clientId = "75d6012515364a608ebbf7ec5113308c";
  // Setting credentials
  var spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId
  });
  // Create the authorization URL for the User
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  
  res.send({"data": authorizeURL});
  });


  app.post('/getcode', function getCode(req, res, next) {
    try {
        await connectMongo();
        console.log(req.body);
        let code = req.body;

        await mongo.addCode(code);
        console.log(code);
        res.status(200).send("Users code has been added to DB")
    } catch (error) {
        console.log(error);
    }
  });

  app.get('/getcode', function retrieveCode(req, res, next) {
 
    try {
        await connectMongo();
        let code = await mongo.getCode();
    } catch (error) {
        console.log(error);
    }
  res.send({"code": code});
  });




/*CONNECTION TO MY MONGODB DATABASE*/
async function connectMongo() {
mongoose.connect(process.env.URL);
const db = mongoose.connection;
//Log error if connection fails
db.on('error', (error) => console.error(error));
// Conseole log a succesfull connection to DB
db.once('open', () => console.log('Succesfully connected to Database'));
}

async function addCode(code) {
    const result = await challengesCollection.insertOne(code);
    console.log('Added code for the user =>', code);
    return result;
  }

  async function getCode() {
    const code = await challengesCollection.find({});
    console.log('User code is =>', code);
    return code;
  }
  

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