// db.js

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '85.31.225.77',
  port: 5433,
  database: 'postgres',
  password: 'sarirotib451',
});

module.exports = pool;
