// db.js

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '103.157.96.125',
  port: 5438,
  database: 'postgres',
  password: 'password_baru',
});

module.exports = pool;
