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

app.get('/connect', async (req, res, next) => {
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


  var credentials = {
    clientId: '75d6012515364a608ebbf7ec5113308c',
    clientSecret: 'e9069eeeb800474394cbe578f1a93c67',
    redirectUri: 'http://127.0.0.1:5500/web2-frontend-IlyesDjari/docs/pages/home.html'
  };
  
  var spotifyApi = new SpotifyWebApi(credentials);
   await mdb.connectMongo();
  let lastcode = await mdb.lastCode();
  let tokenExpirationEpoch;
  console.log(lastcode);

 
  spotifyApi.authorizationCodeGrant(lastcode).then(
    function(data) {
      // Set the access token and refresh token
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
  
      // Save the amount of seconds until the access token expired
      tokenExpirationEpoch =
        new Date().getTime() / 1000 + data.body['expires_in'];
      console.log(
        'Retrieved token. It expires in ' +
          Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
          ' seconds!'
      );
    },
    function(err) {
      console.log(
        'Something went wrong when retrieving the access token!',
        err.message
      );
    }
  );

  mdb.closeDatabaseConnection();
  
  });






  app.get("/releases", async (req, res, next) => {

    var credentials = {
      clientId: '75d6012515364a608ebbf7ec5113308c',
      clientSecret: 'e9069eeeb800474394cbe578f1a93c67',
      redirectUri: 'http://127.0.0.1:5500/web2-frontend-IlyesDjari/docs/pages/home.html'
    };
    
    var spotifyApi = new SpotifyWebApi(credentials);
     await mdb.connectMongo();
    let lastcode = await mdb.lastCode();
    console.log(lastcode);
  
   
    spotifyApi.authorizationCodeGrant(lastcode).then(
      function(data) {
        // Set the access token and refresh token
        spotifyApi.setAccessToken(data.body['access_token']);
        return spotifyApi.getNewReleases({ limit : 6, offset: 0, country: 'BE' })
      .then(function(data) {
    console.log(data.body);
    res.send(data.body);
    }, function(err) {
       console.log("Something went wrong!", err);
    });
      }
    );
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