"use strict"


/*CONNECTION TO MY MONGODB DATABASE*/
const mdb = require('mongodb');
require('dotenv').config();

const URL = process.env.URL;

const client = new mdb.MongoClient(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

    async function connectMongo() {
    await client.connect();
    console.log("Successfully connected to database!")
    }


    async function getCode() {
        const db = client.db('Oto');
        const code = db.collection("code");
        const searchCode =  await code.find({}).toArray();
        return searchCode;
    }
    

    async function addCode(bodycode) {
      const database = client.db('Oto');
      const playlists = database.collection("playlists");
      const sentCode = await playlists.insertOne({bodycode})
      console.log("Here is the sent playlist",sentCode);
        return sentCode;
    }

    async function lastCode() {
     
      const db = client.db('Oto');
      const code = db.collection("code");
      const searchCode =  await code.find({}).toArray();
      var last = searchCode[searchCode.length-1].bodycode;
     return last;
    }

      
    function closeDatabaseConnection() {
        client.close();
      }
        module.exports = {
            connectMongo,
            closeDatabaseConnection,
            addCode,
            getCode,
            lastCode
          };