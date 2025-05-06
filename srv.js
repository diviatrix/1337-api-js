const express = require('express');
const config = require('./components/config');
const messages = require('./components/messages');
const api = require('./routes/api');
const db = require('./components/db'); // Import the database module
const adapter = db.adapter; // Get the database adapter
const dbRouter = require('./routes/db'); // Import the db router
const auth = require('./routes/auth'); // Import the auth route
const log = require('./components/log'); // Import the log module
const lh = require('./components/log_helper'); // Import the log helper module

const webapp = express();

// Middleware to parse JSON bodies
webapp.use(express.json());
webapp.use('/api', api);
webapp.use('/api/auth', auth);
webapp.use('/api/db', dbRouter); // Use the db router

// Debug adapter to ensure it has init method
log.log(`Adapter loaded: ${Object.keys(adapter).join(', ')}`); // Log as string, no color

// Initialize database tables
if (typeof adapter.init === 'function') {
    adapter.init((err, result) => {
        if (err) {
            log.logError(err);
        } else {
            log.log(`Database initialized: ${result}`, 'green');
        }
    });
} else {
    log.logError(new Error('Adapter does not have an init method. Check ./components/db.js and ./db-adapters/sqlite.js'));
}

// Error-handling middleware for JSON parsing errors
webapp.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        log.logError(err);
        return res.status(400).json({
            message: 'Invalid JSON format',
            error: 'Request body contains invalid JSON. Check for trailing commas or incorrect syntax.'
        });
    }
    next(err);
});

// Start the server
webapp.listen(config.port, () => {  
    log.log(`[Version]: ${messages.apiVersion}`, 'green');
    log.log(`[Name]: ${messages.apiName}`, 'green');
    log.log(`[Environment]: ${config.env}`, 'green');
    log.log(`[Port]: ${config.port}`, 'green_bright');
    log.log(`[Status]: ${messages.statusMessage}`, 'green');
});

module.exports = {
    webapp,
    dbRouter,
    adapter,
    db,
    auth,
    api,
    config,
    messages,
    log,
    lh
};