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
  clientId = '75d6012515364a608ebbf7ec5113308c',
  state = 'some-state-of-my-choice';

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
  redirectUri: "http://127.0.0.1:5500/web2-frontend-IlyesDjari/docs/pages/home.html",
  clientId: "75d6012515364a608ebbf7ec5113308c"
});
  // Create the authorization URL for the User
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  res.send({"data": authorizeURL});  
  });










  app.get("/releases", async (req, res, next) => {


     await mdb.connectMongo();
    let authorizationCode = await mdb.lastCode();
    console.log(authorizationCode);
  
    var credentials = {
      clientId: '75d6012515364a608ebbf7ec5113308c',
      clientSecret: 'e9069eeeb800474394cbe578f1a93c67',
      redirectUri: 'http://127.0.0.1:5500/web2-frontend-IlyesDjari/docs/pages/home.html'
    };
    
    var spotifyApi = new SpotifyWebApi(credentials);
    
    // The code that's returned as a query parameter to the redirect URI
    var code = await lastCode();
    console.log(code);
    
    // Retrieve an access token and a refresh token
    spotifyApi.authorizationCodeGrant(code).then(
      function(data) {
        console.log('The token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
        console.log('The refresh token is ' + data.body['refresh_token']);
    
        // Set the access token on the API object to use it in later calls
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
      },
      function(err) {
        console.log('Something went wrong!', err);
      }
    );

    spotifyApi.refreshAccessToken().then(
      function(data) {
        console.log('The access token has been refreshed!');
    
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
      },
      function(err) {
        console.log('Could not refresh access token', err);
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



app.use(express.static('public'));

console.log(PORT);

app.listen(PORT, () =>
  console.log(
    'HTTP Server up.'
  )
);
