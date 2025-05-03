const express = require('express');
const config = require('./components/config');
const messages = require('./components/messages');
const api = require('./routes/api');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use('/', api);

// Start the server
app.listen(config.port, () => {
  console.log(`[Mode]: ${config.env}
[Port]: ${config.port}
[Server]: ${messages.statusMessage}`);
});