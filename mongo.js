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
    

    async function addCode(body) {
      const db = client.db('Oto');
      const code = db.collection("code");
      const sentCode = await code.insertOne(
        {
        _id: mdb.ObjectId()
    }, 
        {
        code: {
            body
        }
    });

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