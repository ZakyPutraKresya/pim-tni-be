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
       const query = `
         UPDATE app_slideshow
         SET url = $1,
             author = $2,
             data_time = NOW()
         WHERE id = $3;
       `;
   
       // Eksekusi query dengan parameter yang diambil dari body request
       await pool.query(query, [fileName, author, id]);
   
       res.status(200).json({ message: 'Data berhasil diupdate.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
});

module.exports = router;
