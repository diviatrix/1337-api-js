const express = require('express');
const router = express.Router();
const messages = require('../components/messages');
const db = require('../components/db'); // Import the database module
const lr = require('../components/log_request'); // Import the log request module

// Basic GET endpoint
router.get('/', (req, res) => {
    // Log the request method and URL
    lr.log(req);    
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      message: messages.auth,
      status: db ? messages.dbConnectionSuccess : messages.dbConnectionError
    });
});

module.exports = router;