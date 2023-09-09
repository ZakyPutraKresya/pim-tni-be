const express = require("express");
const router = express.Router();
const pool = require("../db");


// Middleware untuk mengizinkan Express menguraikan body dalam format JSON
router.use(express.json());

// Middleware untuk mengizinkan Express menguraikan form data
router.use(express.urlencoded({ extended: true }));


router.get("/slideshow", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM app_slideshow");
    res.json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/upload", async (req, res) => {
  
    const { fileName, author, id } = req.body;
    try {
       // Mengambil koneksi dari pool
       const connection = await pool.getConnection();

       // Query untuk mengupdate data di tabel app_slideshow
       const query = `
         UPDATE app_slideshow
         SET url = ?,
             author = ?,
             data_time = NOW()
         WHERE id = ?;
       `;
   
       // Eksekusi query dengan parameter yang diambil dari body request
       await connection.execute(query, [fileName, author, id]);
   
       res.status(200).json({ message: 'Data berhasil diupdate.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
      }
});

module.exports = router;
