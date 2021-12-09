"use strict"



let redirect_uri = "http://127.0.0.1:5500/web2-frontend-IlyesDjari/pages/home.html";
let client_id = "75d6012515364a608ebbf7ec5113308c";
let client_secret = "e9069eeeb800474394cbe578f1a93c67";
let access_token = null;
let refresh_token = null;

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYER = "https://api.spotify.com/v1/me/player";
const CURRENTLYPLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const PROFILE = "https://api.spotify.com/v1/me";
const CHOICES = [];

document.documentElement.addEventListener("load", function () {
    document.getElementById("loader").style.display = "block";
});

window.addEventListener("load", function () {
    document.getElementById("loader").style.display = "none";
});


function onPageLoad() {
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");

    if (window.location.search.length > 0) {
        handleRedirect();
    } else {
        access_token = localStorage.getItem("access_token");
        if (access_token == null) {
            document.getElementById("tokenSection").style.display = 'block';
        } else {
            userInformation();
            currentlyPlaying();
            newRelease();
        }
    }
}

function handleRedirect() {
    let code = getCode();
    fetchAccessToken(code);
    window.history.pushState("", "", redirect_uri);
}

function getCode() {
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }
    return code;
}

function requestAuthorization() {
    client_id = '75d6012515364a608ebbf7ec5113308c';
    client_secret = 'e9069eeeb800474394cbe578f1a93c67';
    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret);
    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url;
}

function fetchAccessToken(code) {
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}

function refreshAccessToken() {
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse() {
    if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        console.log(data);
        if (data.access_token != undefined) {
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if (data.refresh_token != undefined) {
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    } else {
        console.log(this.responseText);
        alert(this.responseText);
    }
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


function reply_click(clicked_id) {
    CHOICES.push(clicked_id);
    console.log(CHOICES);

    /* document.getElementById("choices").style.display = "none";
     document.getElementById("lengthtimeline").style.backgroundColor = "#A065FF";
     document.getElementById("lengthtimeline").style.width = "22.5vw";
     document.getElementById("genre").style.transform = "scale(1)";
     document.getElementById("mood").style.transform = "scale(1.1)";
     document.getElementById("mood").style.backgroundColor = "#A065FF";
     document.getElementById("moodimg").style.opacity = "1";
     document.getElementById("choicesmood").style.display = "flex";
     document.getElementById("generate").style.display = "none";
     */
}