"use strict"


import "dotenv/config";
import express from "express";
import cors from "cors";
import SpotifyWebApi from "spotify-web-api-node";
import * as mdb from "./mongo.js";

const app = express();
const PORT = process.env.PORT || 8888;

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYER = "https://api.spotify.com/v1/me/player";
const CURRENTLYPLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const PROFILE = "https://api.spotify.com/v1/me";
const CHOICES = [];



// Avoid any CORS error :'(
app.use(cors());


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

  
  // app.post('/getcode', function getCode(req, res, next) {

  //   console.log("hello");
  //   try {
  //       mdb.connectMongo();
  //       console.log(req.body);
  //       let thecode = req.body;
  //       mdb.addCode(thecode);
  //       console.log(thecode);
  //       res.status(200).send("Users code has been added to DB");

  //   } catch (error) {
  //       console.log(error);
  //   }
  //   finally {
  //     mdb.closeDatabaseConnection();
  //   }
  // });

  app.get('/getcode', function retrieveCode(req, res, next) {
    try {
        mdb.connectMongo();
        let foundcode = mdb.getCode();
        res.send({"code": foundcode});
    } catch (error) {
        console.log(error);
    }
    finally {
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