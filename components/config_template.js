module.exports = {
    port: process.env.PORT || 7331,
    env: process.env.NODE_ENV || 'development',
    databasePath: process.env.DATABASE_PATH || './db/database.db'
  };