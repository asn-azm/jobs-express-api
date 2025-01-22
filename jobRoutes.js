const connectToDatabase = require('./util.js');
const { ObjectId } = require('mongodb');

// get all jobs
const getAllJobs = async (req, res) => {
    try {
        const { db } = await connectToDatabase();
        const jobsCollection = db.collection('jobs');
        const jobs = await jobsCollection.find({}).toArray();  // Await this call
        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: 'Failed to fetch jobs!' });
    }
};

// get Job by id
const getJobById = async (req, res) => {
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
}

// update a job
const updateJob = async (req, res) => {
    const { id } = req.params;
    const updatedJob = req.body;
    console.log(JSON.stringify(updatedJob));
    try {
        const { db } = await connectToDatabase();
        const jobsCollection = db.collection('jobs');
        const result = await jobsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedJob }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json({ message: 'Job updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update job' });
    }
}

// add new job
const addjob = async (req, res) => {
    const newJob = req.body; // Assuming job has these fields
    try {
        const { db } = await connectToDatabase();
        const jobsCollection = db.collection('jobs');
        const result = await jobsCollection.insertOne(newJob);
        res.status(201).json({ message: 'Job added successfully', jobId: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add job' });
    }
}

// delete job by id

const deleteJobById = async (req, res) => {
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
}

module.exports = {
    getAllJobs,
    getJobById,
    updateJob,
    addjob,
    deleteJobById
}
