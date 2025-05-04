const express = require('express');
const config = require('./components/config');
const messages = require('./components/messages');
const api = require('./routes/api');
const db = require('./components/db'); 
const auth = require('./routes/auth'); // Import the auth route

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use('/auth', auth);
app.use('/api', api);
app.use('/db', db);

// Start the server
app.listen(config.port, () => {
  console.log(`[Server]: ${messages.welcome}
[Mode]: ${config.env}
[Port]: ${config.port}`);
});