const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware untuk mengizinkan Express menguraikan body dalam format JSON
router.use(express.json());

// Middleware untuk mengizinkan Express menguraikan form data
router.use(express.urlencoded({ extended: true }));

router.get("/slideshow", async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT * FROM app_slideshow ORDER BY id ASC"
    );
    res.json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Tidak ada file yang diunggah" });
  }

  // Dapatkan data 'author' dari FormData
  const author = req.body.author;
  const id = req.body.id;
  const filename = "/uploads/" + req.file.filename; // Nama file yang diunggah

  // Update data di tabel app_slideshow
  const slideshowQuery = `
      UPDATE app_slideshow
      SET url = $1,
          author = $2,
          data_time = NOW()
      WHERE id = $3
    `;

  // Ganti $1, $2, dan $3 dengan nilai yang sesuai
  pool.query(slideshowQuery, [filename, author, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Gagal melakukan update data " });
    }

    // Jika query update berhasil, kirim respons sukses
    res.json({
      message: "File berhasil diunggah dan informasi diupdate di database",
    });
  });
});

module.exports = router;
