// Description: This module logs the request details including method, URL, token, and headers.
const lh = require('./log_helper'); // Import the log helper module
const log = require('./log'); // Import the log module
module.exports = {
    log: function (request) {
            log.log(request.method);
            log.log(request.url);
            log.log(request.token || 'N/A');
            this.logHeaders(request.headers);
        },
    logHeaders: function (headers) {
        log.log(lh.paint(`[Headers]:`, 'yellow_bright') + JSON.stringify(headers, null, 2));
    }
};
