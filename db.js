// db.js

const { Pool } = require('pg');

const pool = new Pool({
  user: 'default',
  host: 'ep-little-bread-96812048-pooler.us-east-1.postgres.vercel-storage.com',
  database: 'verceldb',
  password: 'Vms6rtl7ODpw',
});

module.exports = pool;
