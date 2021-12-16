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
      const code = database.collection("code");
      const sentCode = await code.insertOne({bodycode})
      console.log("Here is the sent code",sentCode);
        return sentCode;
    }
      
    function closeDatabaseConnection() {
        client.close();
      }
        module.exports = {
            connectMongo,
            closeDatabaseConnection,
            addCode,
            getCode
          };