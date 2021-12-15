"use strict"


/*CONNECTION TO MY MONGODB DATABASE*/
import * as mdb from "mongodb";
import "dotenv/config";

const uri = process.env.URL;

const client = new mongo.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});






    async function connectMongo() {
    await client.connect();
    console.log("Successfully connected to database!")
    }

    async function getCode() {
        const code = await code.find({});
        console.log('User code is =>', code);
        return code;
    }

    async function addCode(code) {
        const result = await code.insertOne(code);
        console.log('Added code for the user =>', code);
        return code;
    }
      


     
        export {
            connectMongo,
            closeDatabaseConnection,
            addCode,
            getCode,
          };