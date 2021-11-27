// Load all environment variables from env file
require('dotenv').config();
// To use express library
const express = require('express');
const router = express.Router()
const req = require('express/lib/request');
// Create app variable to configure server
const app = express();
// To use mongoose library
const mongoose = require('mongoose');
// Require the spotify web api library
const SpotifyWebApi = require('spotify-web-api-node');


/*CONNECTION TO MY MONGODB DATABASE*/ 
mongoose.connect(process.env.URL);
const db = mongoose.connection;
//Log error if connection fails
db.on('error', (error) => console.error(error));
// Conseole log a succesfull connection to DB
db.once('open', () => console.log('Succesfully connected to Database'));

// Accept JSON as a body instead of POST element
app.use(express.json());

// Preparing for hosting environment, support of dynamic port, if none => use 3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));



/*LOGIN OF SPOTIFY*/ 

// All the autorizations i'm requisting the user in order to receive data

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
let spotifyApi = new SpotifyWebApi({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  redirectUri: process.env.redirectURL
});



app.get('/login', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);
      res.send(data);
      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];
        spotifyApi.setAccessToken(access_token);
      }, expires_in / 2 * 1000);
    });
});



app.get('/current', (res, req) => {

  const token = spotifyApi.getAccessToken;
  
  spotifyApi.getMyCurrentPlayingTrack(token)
  .then(function(data) {
    console.log('Now playing: ' + data.body.item.name);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});
