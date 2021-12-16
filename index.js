"use strict"


require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const SpotifyWebApi = require('spotify-web-api-node')
const mdb = require('./mongo.js');
const PORT = process.env.PORT || 8888;

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYER = "https://api.spotify.com/v1/me/player";
const CURRENTLYPLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const PROFILE = "https://api.spotify.com/v1/me";
const CHOICES = [];

// Avoid any CORS error :'(
app.use(cors());
app.use(bodyParser.json());

app.get('/connect', (req, res, next) => {
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

  app.post('/getcode', async (req, res, next) => {

    if(!req.body.code){
      res.status(400).send('Bad request: missing code');
      return;
  }
    try {
        await mdb.connectMongo();
        let bodycode = req.body.code;
        const sentCode = await mdb.addCode(bodycode);
        res.status(200).send(sentCode);

    } catch (error) {
        console.log(error);
    }
    finally {
      mdb.closeDatabaseConnection();
    }
  });





  app.get('/getcode', async (req, res, next) => {
    try {
        await mdb.connectMongo();
        let searchCode = await mdb.getCode();
        res.status(200).json(searchCode);
    } catch (error) {
        console.log(error);
    } finally {
      mdb.closeDatabaseConnection();
    }
  });

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