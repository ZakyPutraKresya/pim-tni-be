const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Lokasi penyimpanan file
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Nama file akan menjadi timestamp saat diunggah
  },
});

const upload = multer({ storage });
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

  pool.query(slideshowQuery, [filename, author, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Gagal melakukan update data " });
    }
    // if success return response
    res.json({
      message: "Successfully updated data",
      name: filename,
    });
  });
});

module.exports = router;
