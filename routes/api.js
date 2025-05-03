router = require('express').Router();
const config = require('../components/config');
const messages = require('../components/messages');

// Basic GET endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    message: messages.welcome,
    status: messages.statusMessage,
    port: config.port,
    environment: config.env
  });
});

module.exports = router;