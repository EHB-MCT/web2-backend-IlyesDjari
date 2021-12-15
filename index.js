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
  // Create the authorization URL
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  // https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
  res.send({"data": authorizeURL});
  });


  app.get('/getcode', function routeHandler(req, res, next) {

  res.send({"data": code});
  });


  
/*

/*function refreshAccessToken() {
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}



function handleApiResponse() {
    if (this.status == 200) {
        console.log(this.responseText);
        setTimeout(currentlyPlaying, 2000);
    } else if (this.status == 204) {
        setTimeout(currentlyPlaying, 2000);
    } else if (this.status == 401) {
        refreshAccessToken();
    } else {
        console.log(this.responseText);
    }
}

function newRelease() {
    var x = Math.floor(Math.random() * 20);
    const RELEASE = `https://api.spotify.com/v1/browse/new-releases?country=BE&limit=5&offset=${x}`;
    callApi("GET", RELEASE, null, newRealeaseResponse);
}

function currentlyPlaying() {
    callApi("GET", PLAYER, null, handleCurrentlyPlayingResponse);

}

function userInformation() {
    callApi("GET", PROFILE, null, userResponse);
}

function userResponse() {
    var data = JSON.parse(this.responseText);
    const time = new Date().getHours();
    if (data != null) {
        document.getElementById("username").innerHTML = data.display_name;
        document.getElementById("userpicture").src = data.images[0].url;

        if (time < 12) {
            document.getElementById("daytime").innerHTML = "Good morning, ";
        } else if (time < 18) {
            document.getElementById("daytime").innerHTML = "Good afternoon, ";
        } else {
            document.getElementById("daytime").innerHTML = "Good evening, ";
        }
    } else if (this.status == 401) {
        refreshAccessToken();
    }
}


function handleCurrentlyPlayingResponse() {
    var data = JSON.parse(this.responseText);
    console.log(data);
    if (this.status == 200) {
        if (data.item != null) {
            document.getElementById("imgcurrent").src = data.item.album.images[0].url;
            document.getElementById("artistcurrent").innerHTML = data.item.artists[0].name;
            document.getElementById("songcurrent").innerHTML = data.item.name;
            //setTimeout(currentlyPlaying, 1000); 
        }
    } else if (this.status == 401) {
        refreshAccessToken();
    }
}


function newRealeaseResponse() {
    var data = JSON.parse(this.responseText);
    console.log(data);
    if (data.albums != null) {
        for (let i = 0; i < 5; i++) {
            document.getElementById("release").insertAdjacentHTML('afterbegin', `
            <a href="${data.albums.items[i].external_urls.spotify}"">
            <div>
            <img src="${data.albums.items[i].images[0].url}" alt="cover">
            <h3>${data.albums.items[i].artists[0].name}</h3>
            <p>${data.albums.items[i].name}</p>
            </div>
            </a>`);
        }
    } else if (this.status == 401) {
        refreshAccessToken();
    }
}
*/


































/*CONNECTION TO MY MONGODB DATABASE*/
mongoose.connect(process.env.URL);
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