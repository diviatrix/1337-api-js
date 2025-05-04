const express = require('express');
const router = express.Router();
const messages = require('./messages');
const adapter = require('./db-adapters/sqlite');
const log = require('./log'); // Import the log module
const lr = require('./log_request'); // Import the log request module
const lh = require('./log_helper'); // Import the log helper module

if (adapter) {
    log.log(`[DB]: ` + lh.paint(messages.ConnectionSuccess, 'blue'));
} else {
    log.log(messages.ConnectionError, 'red');
}


// Basic GET endpoint
router.get('/', (req, res) => {
    // Log the request method and URL
    lr.log(req);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
        message: messages.db,
        status: adapter.status
    });
});

module.exports = router;
    
