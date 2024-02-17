//import { toISODateTime, toISOTimeStamp } from "./controllers/dateformat.js";
import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const chrOp = 'U';

if (chrOp === 'I') {

    async function run() {
        try {
            const database = client.db("prolog");
            const simCounter = database.collection("simCounter");
            const doc = {
                title: "SIM next Id",
                count: 1
            }
            const result = await simCounter.insertOne(doc);
            console.log(`Result: ${result.insertedId}`);    // 65cfc6b2dda06584f03c536a
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);

    exit(0);
}


async function run() {
    try {
        const database = client.db("prolog");
        const simCounter = database.collection("simCounter");
        // const updateDoc = {
        //     { $set : { title: "SIM next Id"} },
        //     { $inc : { count: 1} }
        // };
        //.const result = await simCounter.updateOne(updateDoc, options);
        const filter = { title: "SIM next Id" };
        const options = { upsert: false };
        const result = await simCounter.findOneAndUpdate(filter, {$inc : { count: 1}}, options);
        console.log(result); 

        simCounter.find();
    } finally {
        await client.close();
    }
}
run().catch(console.dir);
