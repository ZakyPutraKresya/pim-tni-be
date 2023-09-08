// db.js

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'marzaky',
  password: 'sarirotib451',
  port: 5432, // Port default PostgreSQL
});

module.exports = pool;
