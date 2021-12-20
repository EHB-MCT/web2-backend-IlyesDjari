"use strict";

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const mdb = require("./mongo.js");
const PORT = process.env.PORT || 8888;

// credentials
const clientId = "75d6012515364a608ebbf7ec5113308c";
const clientSecret = "e9069eeeb800474394cbe578f1a93c67";
const redirectUri = "http://localhost:8888/releases";

// Avoid any CORS error :'(
app.use(cors());
app.use(bodyParser.json());

let spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
  redirectUri,
});

app.get("/connect", (req, res, next) => {
  let url = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(url);
});

app.get("/releases", async (req, res) => {
  const error = req.query.error;
  const code = req.query.code;

  if (error) {
    console.error("Callback Error:", error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then(async (data) => {
      const access_token = data.body["access_token"];
      const refresh_token = data.body["refresh_token"];
      const expires_in = data.body["expires_in"];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      console.log("access_token:", access_token);
      console.log("refresh_token:", refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      res.send("Success! You can now close the window.");

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body["access_token"];
        spotifyApi.setAccessToken(access_token);
      }, (expires_in / 2) * 1000);
    })
    .catch((error) => {
      console.error("Error getting Tokens:", error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

app.get("/getlist/:username", async (req, res) => {
  let name = req.params.username;
  let list = await spotifyApi.getUserPlaylists(name);
  res.send(list);
});
app.get("/currentsong", async (req, res) => {
  const song = await spotifyApi.getMyCurrentPlayingTrack();
  res.send(song);
});
app.post("/featured", async (req, res) => {
  const obj = req.body;
  console.log("featured called ", obj);
  // {
  //   limit: 5,
  //   offset: 1,
  //   country: "US",
  // }
  const featured = await spotifyApi.getFeaturedPlaylists(obj);
  res.send(featured);
});
app.get("/newreleases", async (req, res) => {
  let releases = await spotifyApi.getNewReleases({
    limit: 5,
    offset: 0,
    country: "US",
    market: "US",
  });
  res.send(releases);
});

app.post("/getcode", async (req, res, next) => {
  if (!req.body.code) {
    res.status(400).send("Bad request: missing code");
    return;
  }
  try {
    await mdb.connectMongo();
    let bodycode = req.body.code;
    const sentCode = await mdb.addCode(bodycode);
    res.status(200).send(sentCode);
  } catch (error) {
    console.log(error);
  } finally {
    mdb.closeDatabaseConnection();
  }
});

app.get("/getcode", async (req, res, next) => {
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

app.use(express.static("public"));

console.log(PORT);

app.listen(PORT, () => console.log("HTTP Server up."));
