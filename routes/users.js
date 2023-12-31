// routes/users.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Menampilkan semua pengguna
router.get('/', async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM app_images_pim');
    res.json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Menambahkan pengguna baru
router.post('/', async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.json(newUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
