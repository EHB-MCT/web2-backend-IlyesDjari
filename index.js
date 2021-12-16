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

const scopes = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify'
];

// Avoid any CORS error :'(
app.use(cors());
app.use(bodyParser.json());

app.get('/connect', async (req, res, next) => {
    
  var spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.URLS,
    clientId: process.env.clientid
  });
  // Create the authorization URL for the User
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.send({"data": authorizeURL});  
  });












  app.get("/releases", async (req, res, next) => {


     await mdb.connectMongo();
    let authorizationCode = await mdb.lastCode();
  
    const spotifyApi = new SpotifyWebApi({
      clientId: '75d6012515364a608ebbf7ec5113308c',
      clientSecret: 'e9069eeeb800474394cbe578f1a93c67',
      redirectUri: 'http://127.0.0.1:5500/web2-frontend-IlyesDjari/docs/pages/home.html'
    });
    
    // When our access token will expire
    let tokenExpirationEpoch;
    
    // First retrieve an access token
    spotifyApi.authorizationCodeGrant(authorizationCode).then(
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
    
    // Continually print out the time left until the token expires..
    let numberOfTimesUpdated = 0;
    
    setInterval(function() {
      console.log(
        'Time left: ' +
          Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
          ' seconds left!'
      );
    
      // OK, we need to refresh the token. Stop printing and refresh.
      if (++numberOfTimesUpdated > 5) {
        clearInterval(this);
    
        // Refresh token and print the new time to expiration.
        spotifyApi.refreshAccessToken().then(
          function(data) {
            tokenExpirationEpoch =
              new Date().getTime() / 1000 + data.body['expires_in'];
            console.log(
              'Refreshed token. It now expires in ' +
                Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
                ' seconds!'
            );
          },
          function(err) {
            console.log('Could not refresh the token!', err.message);
          }
        );
      }
    }, 1000);
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