module.exports = {
  port: process.env.PORT || 7331,
  env: process.env.NODE_ENV || 'development',
  databasePath: process.env.DATABASE_PATH || './db/database.db',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-here', // Use environment variable in production
  db_adapter: process.env.DB_ADAPTER || './db-adapters/sqlite'
};