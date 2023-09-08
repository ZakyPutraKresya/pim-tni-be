// db.js

const { Pool } = require('pg');

const pool = new Pool({
  user: 'uv7psmzz0ikflqglagh9',
  host: 'bksnmpkwrteg7lwulccx-postgresql.services.clever-cloud.com',
  database: 'bksnmpkwrteg7lwulccx',
  password: 'xeemT9PDaaHGfXjKB6pgC92YSC0BGk',
});

module.exports = pool;
