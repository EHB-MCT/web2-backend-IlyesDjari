const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('./public'));

app.get("/", (req,res) => {
    console.log("Hello Ilyes");
    res.send("Hello Ilyes here it is");
});