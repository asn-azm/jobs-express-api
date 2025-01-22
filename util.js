const { MongoClient } = require('mongodb');
let cachedClient = null;
let cachedDb = null;
const uri = process.env.MONGODB_URI;

module.exports = async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }
    try {
        let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();  // Await the connection
        let db = client.db('sample_mflix');  // Use your actual DB name
        cachedClient = client;
        cachedDb = db;
        return { client, db };
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);  // Log the error
        throw new Error("Failed to connect to the database");
    }
}