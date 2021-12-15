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

let redirect_uri = "http://127.0.0.1:5500/web2-frontend-IlyesDjari/docs/pages/home.html";
let client_id = process.env.clientid;
let client_secret = process.env.clientsecret;
let access_token = null;
let refresh_token = null;

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
    clientId = process.env.clientid;
  
  // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
  var spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId
  });
  
  // Create the authorization URL
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  // https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
  res.send({"data": authorizeURL});
  });






  app.get('/code', function handleRedirect(req, res, next) {
    let code = getCode();
    fetchAccessToken(code);
    res.send({"code": code})
    //window.history.pushState("", "", redirect_uri);
})

  function getCode() {
    let code = null;
    client_id = "75d6012515364a608ebbf7ec5113308c";
    client_secret ="e9069eeeb800474394cbe578f1a93c67";
    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    const queryString = "http://127.0.0.1:5500/web2-frontend-IlyesDjari/docs/pages/home.html?code=AQAILGS2xHFpdU-a3tIY5BBPSifSOg6sg6MuBxg0F6GjGPyGWLMcvHprR8kKWAcetj2phoyLCTcAWbnNlE7oija7OZ3yB2YWOheLy6DJ5Al4icYv2xrcjzCtt1R5QNW7JIdxEYzxnTG-Vtf7ArJL1Z08Bgjp5ZY0RzSJZVnxM0tcY_AuXrHI7M1PwUJfi78B5EdwR3nJe1_095ALzFgpb0Uyb7tq3-B2QMO_CWx_By6__IenPJRG46OIYZLwVcUthGYMOhEd4IHG-OCEnAMgY6Km8QexcRkYCGFe1HgniQFO8tYMjVUfbfm-Ukj5LjjRYMSl1jONtksJi7pB_hu74CYDE-tnF9N2ucqO5bpsEMZGZPJAEmb-K1rJGrfFOA-ju_lSPPo6rwfvqwiYrpTmRjOPcdwlAfnSDg8E4jN4kSO3LzzHCD0Eb3A33DH4dD5vVSFsBx4HCRPeXfanT6MqgscViJ7CrkYlGo8EBQ-d";
    console.log(url);
    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }
    return code;
}

function fetchAccessToken(code) {
    console.log("here i am further");
    let body = "grant_type=authorization_code";
    body += "&code=" + "AQAILGS2xHFpdU-a3tIY5BBPSifSOg6sg6MuBxg0F6GjGPyGWLMcvHprR8kKWAcetj2phoyLCTcAWbnNlE7oija7OZ3yB2YWOheLy6DJ5Al4icYv2xrcjzCtt1R5QNW7JIdxEYzxnTG-Vtf7ArJL1Z08Bgjp5ZY0RzSJZVnxM0tcY_AuXrHI7M1PwUJfi78B5EdwR3nJe1_095ALzFgpb0Uyb7tq3-B2QMO_CWx_By6__IenPJRG46OIYZLwVcUthGYMOhEd4IHG-OCEnAMgY6Km8QexcRkYCGFe1HgniQFO8tYMjVUfbfm-Ukj5LjjRYMSl1jONtksJi7pB_hu74CYDE-tnF9N2ucqO5bpsEMZGZPJAEmb-K1rJGrfFOA-ju_lSPPo6rwfvqwiYrpTmRjOPcdwlAfnSDg8E4jN4kSO3LzzHCD0Eb3A33DH4dD5vVSFsBx4HCRPeXfanT6MqgscViJ7CrkYlGo8EBQ-d";
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;

     fetch(TOKEN, {
        method: "POST",
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'Authorization': 'Basic ' + btoa(client_id + ":" + client_secret)
     },
    body: body
    })


    if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        console.log(data);
        if (data.access_token != undefined) {
            access_token = data.access_token;
        }
        if (data.refresh_token != undefined) {
            refresh_token = data.refresh_token;

        }
    } else {
        console.log("Yo", this.responseText);
    }
}

/*

/*function refreshAccessToken() {
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}






function callApi(method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
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