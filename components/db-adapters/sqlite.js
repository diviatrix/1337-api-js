const sqlite3pkg = require('sqlite3');
const config = require('../config.js');
const messages = require('../messages.js');
const log = require('../log.js'); // Import the log module
const tables = require('./sqlite-tables.js'); // Import the tables module
const sqlite3 = sqlite3pkg.verbose();

const db = new sqlite3.Database(config.databasePath, (err) => {
    if (err) {
        log.logError(err);
    } 
});

module.exports = { 
    db,
    status: function() {
        const statusMessage = this.db ? messages.ConnectionSuccess : messages.ConnectionError;
        log.log(`${messages.dbStatus}: ${statusMessage}`, 'blue');
        log.log(`${messages.dbPath}: ${config.databasePath}`, 'blue');
        const result = {
            message: messages.dbStatus,
            db: {
                status: statusMessage,
                path: config.databasePath
            }
        };
        log.log(`Status function returning: ${JSON.stringify(result)}`);
        return result;
    },
    connection: function() {
        if (this.db) {
            log.log(messages.dbStatus, 'blue');
            log.log(`${messages.dbPath}: ${config.databasePath}`, 'blue');
        }
    },
    close: function() {
        this.db.close((err) => {
            if (err) {
                log.logError(err);
            } else {
                log.log(messages.goodbye);
            }
        });
    },
    getAll: function(tableName, callback) {
        this.db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
            if (err) {
                log.logError(err);
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    },
    getById: function(tableName, id, callback) {
        this.db.get(`SELECT * FROM ${tableName} WHERE id = ?`, [id], (err, row) => {
            if (err) {
                log.logError(err);
                callback(err, null);
            } else {
                callback(null, row);
            }
        });
    },
    getByLogin: function(tableName, login, callback) {
        this.db.get(`SELECT * FROM ${tableName} WHERE login = ?`, [login], (err, row) => {
            if (err) {
                log.logError(err);
                callback(err, null);
            } else {
                callback(null, row);
            }
        });
    },
    create: function(tableName, data, callback) {
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const sql = `INSERT INTO ${tableName} (${Object.keys(data).join(', ')}) VALUES (${placeholders})`;
        this.db.run(sql, Object.values(data), function(err) {
            if (err) {
                log.logError(err);
                callback(err, null);
            } else {
                callback(null, { id: this.lastID });
            }
        });
    },
    update: function(tableName, id, data, callback) {
        const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const sql = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
        this.db.run(sql, [...Object.values(data), id], function(err) {
            if (err) {
                log.logError(err);
                callback(err, null);
            } else {
                callback(null, { changes: this.changes });
            }
        });
    },
    remove: function(tableName, id, callback) {
        this.db.run(`DELETE FROM ${tableName} WHERE id = ?`, [id], function(err) {
            if (err) {
                log.logError(err);
                callback(err, null);
            } else {
                callback(null, { changes: this.changes });
            }
        });
    },
    init: function(callback) {
        log.log('Initializing database tables...');        

        let completed = 0;
        let hasError = false;
        tables.tables.forEach(table => {
            this.db.run(table.schema, err => {
                if (err && !hasError) {
                    hasError = true;
                    log.logError(err);
                    if (callback) callback(err);
                }
                completed++;
                if (completed === tables.tables.length && !hasError) {
                    if (callback) callback(null, 'All tables checked/created.');
                }
            });
        });
    }
};