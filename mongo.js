"use strict"


/*CONNECTION TO MY MONGODB DATABASE*/
import * as mdb from "mongodb";
import "dotenv/config";

const uri = process.env.URL;
const dbName = "Oto";

const client = new mdb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
    async function connectMongo() {
    await client.connect();
    console.log("Successfully connected to database!")
    }


    async function getCode() {
        const db = client.db(dbName);
        const collection = db.collection("code");
        const findCode = await collection.find({}).toArray();
        console.log("Found documents =>", findCode);
        return findCode;
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