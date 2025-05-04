const express = require('express');
const config = require('./components/config');
const messages = require('./components/messages');
const api = require('./routes/api');
const db = require('./components/db'); 
const auth = require('./routes/auth'); // Import the auth route
const log = require('./components/log'); // Import the log module
const lh = require('./components/log_helper'); // Import the log helper module

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use('/api', api);
app.use('/api/auth', auth);
app.use('/api/db', db);


// Start the server
app.listen(config.port, () => {  
  log.log(`[Version]: ` + lh.paint(messages.apiVersion, 'green'));
  log.log(`[Name]: ` + lh.paint(messages.apiName, 'green'));
  log.log(`[Environment]: ` + lh.paint(config.env, 'green'));
  log.log(`[Port]: ` + lh.paint(config.port, 'green_bright'));
  log.log(`[Status]: ` + lh.paint(messages.statusMessage, 'green'));
});