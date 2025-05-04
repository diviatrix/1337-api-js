const sqlite3pkg = require('sqlite3');
const config = require('../config.js');
const messages = require('../messages.js');
const log = require('../log.js'); // Import the log module
const lh = require('../log_helper.js'); // Import the log helper module

const sqlite3 = sqlite3pkg.verbose();

const db = new sqlite3.Database(config.databasePath, (err) => {
    if (err) {
        log.error(messages.dbConnectionError, err.message);
    } 
});

module.exports = { 
    db,
    status: function() {
        return (this.db ? messages.dbConnectionSuccess : messages.dbConnectionError);
    },
    close: function() {
        this.db.close((err) => {
            if (err) {
                log.error(lh.paint(err.message), 'red');
            } else {
                log.log(messages.goodbye);
            }
        });
    },
    getAll: function(tableName, callback) {
        this.db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
            if (err) {
                log.error(err.message);
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    },
    getById: function(tableName, id, callback) {
        this.db.get(`SELECT * FROM ${tableName} WHERE id = ?`, [id], (err, row) => {
            if (err) {
                log.error(err.message);
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
                log.error(err.message);
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
                log.error(err.message);
                callback(err, null);
            } else {
                callback(null, { changes: this.changes });
            }
        });
    },
    remove: function(tableName, id, callback) {
        this.db.run(`DELETE FROM ${tableName} WHERE id = ?`, [id], function(err) {
            if (err) {
                log.error(err.message);
                callback(err, null);
            } else {
                callback(null, { changes: this.changes });
            }
        });
    },
    init: function(callback) {
        const tables = [
            {
                name: 'users',
                schema: `CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    email TEXT UNIQUE,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`
            },
            {
                name: 'session',
                schema: `CREATE TABLE IF NOT EXISTS session (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    token TEXT UNIQUE NOT NULL,
                    expires_at DATETIME,
                    FOREIGN KEY(user_id) REFERENCES users(id)
                )`
            },
            {
                name: 'records',
                schema: `CREATE TABLE IF NOT EXISTS records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    data TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(user_id) REFERENCES users(id)
                )`
            },
            {
                name: 'uploads',
                schema: `CREATE TABLE IF NOT EXISTS uploads (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    filename TEXT,
                    path TEXT,
                    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(user_id) REFERENCES users(id)
                )`
            },
            {
                name: 'account',
                schema: `CREATE TABLE IF NOT EXISTS account (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    balance REAL DEFAULT 0,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(user_id) REFERENCES users(id)
                )`
            },
            {
                name: 'comments',
                schema: `CREATE TABLE IF NOT EXISTS comments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    record_id INTEGER,
                    comment TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(user_id) REFERENCES users(id),
                    FOREIGN KEY(record_id) REFERENCES records(id)
                )`
            },
            {
                name: 'groups',
                schema: `CREATE TABLE IF NOT EXISTS groups (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL,
                    description TEXT
                )`
            },
            {
                name: 'settings',
                schema: `CREATE TABLE IF NOT EXISTS settings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    key TEXT,
                    value TEXT,
                    FOREIGN KEY(user_id) REFERENCES users(id)
                )`
            },
            {
                name: 'bonus',
                schema: `CREATE TABLE IF NOT EXISTS bonus (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    used BOOLEAN DEFAULT FALSE,
                    amount REAL,
                    granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(user_id) REFERENCES users(id)
                )`
            }
        ];

        let completed = 0;
        let hasError = false;
        tables.forEach(table => {
            this.db.run(table.schema, err => {
                if (err && !hasError) {
                    hasError = true;
                    log.error(`Error creating table ${table.name}: ${err.message}`);
                    if (callback) callback(err);
                }
                completed++;
                if (completed === tables.length && !hasError) {
                    if (callback) callback(null, 'All tables checked/created.');
                }
            });
        });
    }
};