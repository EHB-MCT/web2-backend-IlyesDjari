"use strict"


/*CONNECTION TO MY MONGODB DATABASE*/
import * as mdb from "mongodb";
import "dotenv/config";

const uri = process.env.URL;

const client = new mdb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


    async function connectMongo() {
    await client.connect();
    console.log("Successfully connected to database!")
    }

    async function getCode() {
        const findcode = code.find({});
        console.log('User code is =>', findcode);
        return findcode;
    }

    // async function addCode(code) {
    //     const addcode = code.insertOne(addcode);
    //     console.log('Added code for the user =>', addcode);
    //     return addcode;
    // }
      
    function closeDatabaseConnection() {
        mongoClient.close();
      }

     
        export {
            connectMongo,
            closeDatabaseConnection,
            //addCode,
            getCode,
          };