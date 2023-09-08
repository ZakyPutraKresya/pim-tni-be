// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import library JWT
const pool = require('../db');
const { JWT_SECRET } = process.env; // Anda perlu mengatur variabel lingkungan untuk JWT_SECRET

// Middleware untuk mengizinkan Express menguraikan body dalam format JSON
router.use(express.json());

// Middleware untuk mengizinkan Express menguraikan form data
router.use(express.urlencoded({ extended: true }));

// Rute untuk login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM app_users_pim WHERE username = $1', [username]);
    // Jika pengguna tidak ditemukan, kirim respon kesalahan
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Nama pengguna atau kata sandi salah.' });
    }

    // Bandingkan kata sandi yang diberikan dengan yang ada di database
    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);

    // Jika kata sandi valid, buat token dan tetapkan waktu kedaluwarsa
    if (isPasswordValid) {
      const token = jwt.sign({ userId: user.rows[0].id }, JWT_SECRET, {
        expiresIn: '12h', // Token akan kedaluwarsa setelah 12 jam
      });

      // Tetapkan waktu kedaluwarsa token ke dalam tabel pengguna
      await pool.query(
        'UPDATE app_users_pim SET token_timeout = NOW() + INTERVAL \'12 hour\' WHERE id = $1',
        [user.rows[0].id]
      );

      res.status(200).json({ token: token });
    } else {
      res.status(401).json({ message: 'Nama pengguna atau kata sandi salah.' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

module.exports = router;
