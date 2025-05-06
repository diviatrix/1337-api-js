const messages = require('./messages');
const log = require('./log'); // Import the log module
const lh = require('./log_helper'); // Import the log helper module
const config = require('./config'); // Import the config module
const adapter = require(config.db_adapter); // Import the database adapter

if (adapter) {
    log.log(`[DB]: ${messages.ConnectionSuccess}`, 'blue');
    log.log(`Adapter methods: ${Object.keys(adapter).join(', ')}`); // Log as string, no color
} else {
    log.log(messages.ConnectionError, 'red');
}

module.exports = {
    adapter
};