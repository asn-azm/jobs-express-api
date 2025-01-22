require('dotenv').config();
const express = require('express');
const cors = require('cors')
const {ObjectId } = require('mongodb');
const  connectToDatabase  = require('./util.js');
const {getAllJobs, getJobById, updateJob, addjob, deleteJobById} = require('./jobRoutes.js')

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Welcome to the Jobs API')
})

// Get all jobs
app.get('/api/jobs', getAllJobs)

// Get a job by ID
app.get('/api/jobs/:id', getJobById);

// Update a job by ID
app.put('/api/jobs/:id', updateJob);

// Add a new job
app.post('/api/jobs', addjob);

// Delete a job by ID
app.delete('/api/jobs/:id', deleteJobById);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;



