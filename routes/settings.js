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

router.get("/", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM app_header_image ORDER BY title ASC");
    //   const data = users.rows[0];
    res.status(200).json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/editList", upload.single("file"), (req, res) => {
  const id = req.body.id;
  if (req.file) {
    const query = `UPDATE app_header_image
    SET image = $1
    WHERE id = $2`;

    pool.query(query, [req.file.filename, id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      // if success return response
      res.json({
        message: "Successfully updated data",
      });
    });
  } else {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.post("/detailItem", upload.single("file"), (req, res) => {
  const id = req.body.id;
  const query = `SELECT * FROM app_header_image
  WHERE id = $1`;

  if (!req.file) {
    pool.query(query, [id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        // if success return response
        return res.status(200).json(result.rows)
      });
  }
})
module.exports = router;
