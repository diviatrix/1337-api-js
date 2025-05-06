const express = require('express');
const router = express.Router();
const db = require('../components/db'); // Import the database module
const adapter = db.adapter; // Get the database adapter
const lr = require('../components/log_request'); // Import the log request module

// Basic GET endpoint
router.get('/', (req, res) => {
    // Log the request method and URL
    lr.log(req);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const status = adapter.status(); // Call status as a function
    res.status(200).json({
        message: "Database module",
        db: {
            status: status.db.status || 'OK',
            connection: adapter.db ? 'Connected' : 'Not connected',
            name: adapter.db ? 'SQLite' : 'No database',
            path: status.db.path || 'Unknown'
        }
    });
});

module.exports = router;