const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/slideshow', async (req, res) => {
    try {
      const users = await pool.query('SELECT * FROM app_slideshow');
      res.json(users.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  