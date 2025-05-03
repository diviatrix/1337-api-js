const express = require('express');
const router = express.Router();
const config = require('../components/config');
const messages = require('../components/messages');

// Basic GET endpoint
router.get('/', (req, res) => {
  // Log the request method and URL
  logRequest(req);

  // Helper function for generic request logging
  function logRequest(request) {
    console.log(`\x1b[36m[Method]:\x1b[0m ${request.method} \n\x1b[36m[URL]:\x1b[0m ${request.url}`);
    console.log(`\x1b[33m[Token]:\x1b[0m ${request.token || 'N/A'} \n\x1b[33m[Headers]:\x1b[0m ${JSON.stringify(request.headers, null, 2)}`);
  }

  res.setHeader('ORIGIN', '1337.plus');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    message: messages.welcome,
    status: messages.statusMessage,
    port: config.port,
    environment: config.env
  });
});

module.exports = router;