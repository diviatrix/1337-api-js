const colors = require('./colors'); // Import the log module
const lh = require('./log_helper'); // Import the log helper module
function getCallerName() {
    const err = new Error();
    const stack = err.stack.split('\n');
    // stack[0] = 'Error'
    // stack[1] = this function (getCallerName)
    // stack[2] = the log function
    // stack[3] = the caller of the log function
    if (stack[3]) {
        const match = stack[3].match(/at (\S+)/);
        return match ? match[1] : 'unknown';
    }
    return 'unknown';
}

module.exports = {
    logError: function (error) {
        const caller = getCallerName();
        console.error(this.callerString(caller) + lh.paint(`[Error]`, colors.colors.red) + error.message);
    },
    log: function (info, color) {
        const caller = getCallerName();
        if (color) {
            console.log(this.callerString(caller) + lh.paint(info, color));
        } else {
            console.log(this.callerString(caller) + info);
        }
    },
    logWarning: function (warning) {
        const caller = getCallerName();
        this.callerString(caller);
        console.log(lh.paint(`[${warning}]: `, `yellow_bright`));
    },
    callerString: function (caller) {
        return lh.paint(lh.paint(`[${new Date().toLocaleString()}]: `, `gray`) + `[${caller}]: `, `gray`);
    },
};