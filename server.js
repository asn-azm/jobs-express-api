require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 5000;

let cachedClient = null;
let cachedDb = null;
const uri = process.env.MONGODB_URI;

async function connectToDatabase() {
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




app.get('/', (req, res) => {
    res.send('Welcome to the Jobs API')
})

// Get all jobs
app.get('/api/jobs', async (req, res) => {
    try {
        const { db } = await connectToDatabase();
        const jobsCollection = db.collection('jobs');
        const jobs = await jobsCollection.find({}).toArray();  // Await this call
        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: 'Failed to fetch jobs!' });
    }
});

// Get a job by ID
app.get('/api/jobs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { db } = await connectToDatabase();
        const jobsCollection = db.collection('jobs');
        const job = await jobsCollection.findOne({ _id: new ObjectId(id) });
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch job' });
    }
});

// Update a job by ID
app.put('/api/jobs/:id', async (req, res) => {
    const { id } = req.params;
    const { title, company, description } = req.body;
    try {
        const { db } = await connectToDatabase();
        const jobsCollection = db.collection('jobs');
        const result = await jobsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { title, company, description } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json({ message: 'Job updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update job' });
    }
});

// Delete a job by ID
app.delete('/api/jobs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { db } = await connectToDatabase();
        const jobsCollection = db.collection('jobs');
        const result = await jobsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete job' });
    }
});

// Add a new job
app.post('/api/jobs', async (req, res) => {
    const { title, company, description } = req.body; // Assuming job has these fields
    try {
        const { db } = await connectToDatabase();
        const jobsCollection = db.collection('jobs');
        const result = await jobsCollection.insertOne({ title, company, description });
        res.status(201).json({ message: 'Job added successfully', jobId: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add job' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



