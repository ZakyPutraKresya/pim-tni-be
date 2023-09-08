// routes/secure.js

const express = require('express');
const router = express.Router();
const checkTokenExpiration = require('./auth'); // Import middleware checkTokenExpiration

// Rute yang memerlukan autentikasi
router.get('/secure-route', checkTokenExpiration, (req, res) => {
  // Ini adalah rute yang hanya dapat diakses oleh pengguna yang sudah login
  res.status(200).json({ message: 'Rute aman berhasil diakses.' });
});

module.exports = router;
