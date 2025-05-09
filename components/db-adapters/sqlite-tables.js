const tables = [
    {
        name: 'users',
        schema: `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            login TEXT UNIQUE NOT NULL,
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
            title TEXT,
            content TEXT,
            category TEXT,
            tags TEXT,
            thumbnail_url TEXT,
            published BOOLEAN DEFAULT FALSE,
            published_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`
    },
    {
        name: 'tags',
        schema: `CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT,
            name TEXT UNIQUE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
            group_id INTEGER,
            nickname TEXT,
            avatar_url TEXT,
            bio TEXT,
            telegram TEXT,
            discord TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(group_id) REFERENCES groups(id)
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
            parent_id INTEGER, 
            level INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
    },
    {
        name: 'bank',
        schema: `CREATE TABLE IF NOT EXISTS bank (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            balance REAL DEFAULT 0,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`
    }
];

module.exports = {
    tables
};