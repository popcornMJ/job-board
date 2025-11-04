const express = require('express');
const router = express.Router();
const db = require('../db-connector');

// Show all jobs
router.get('/', (req, res) => {
    const query = "SELECT * FROM jobs;";
    db.pool.query(query, (err, results) => {
        if (err) throw err;
        res.render('jobs', { jobs: results });
    });
});

// Add a new job
router.post('/add', (req, res) => {
    const { title, body } = req.body;
    const query = "INSERT INTO jobs (title, body) VALUES (?, ?);";
    db.pool.query(query, [title, body], (err, result) => {
        if (err) throw err;
        res.redirect('/jobs');
    });
});

// Delete a job
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM jobs WHERE job_id = ?;";
    db.pool.query(query, [id], (err, result) => {
        if (err) throw err;
        res.redirect('/jobs');
    });
});

// Update a job (basic version)
router.post('/update/:id', (req, res) => {
    const { id } = req.params;
    const { title, body } = req.body;
    const query = "UPDATE jobs SET title = ?, body = ? WHERE job_id = ?;";
    db.pool.query(query, [title, body, id], (err, result) => {
        if (err) throw err;
        res.redirect('/jobs');
    });
});

module.exports = router;
