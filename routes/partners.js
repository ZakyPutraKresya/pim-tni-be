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
    const users = await pool.query(
      "SELECT * FROM app_our_partners ORDER BY id DESC"
    );
    res.json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/createList", upload.single("file"), (req, res) => {
  // Dapatkan data 'title' dari FormData
  const name = req.body.name;
  const url = req.body.url;

  if (req.file) {
    // Update data di tabel app_slideshow
    const slideshowQuery = `
        INSERT INTO app_our_partners (name, image, url) VALUES ($1, $2, $3)
      `;

    pool.query(slideshowQuery, [name, req.file.filename, url], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      // if success return response
      res.status(200).json({
        message: "Successfully insert data",
      });
    });
  } else {
    // if success return response
    res.status(500).json({
      message: "Image is required",
    });
  }
});

router.post("/editList", upload.single("file"), (req, res) => {
  const name = req.body.name;
  const url = req.body.url;
  const id = req.body.id;
  if (req.file) {
    // Update data di tabel app_slideshow
    // name, description, image
    const query = `UPDATE app_our_partners
      SET name = $1,
          image = $2,
          url = $3
      WHERE id = $4`;

    pool.query(
      query,
      [name, req.file.filename, url, id],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        // if success return response
        res.json({
          message: "Successfully updated data",
        });
      }
    );
  } else {
    // Update data di tabel app_slideshow
    const query = `UPDATE app_our_partners
      SET title = $1,
          url = $2
      WHERE id = $3`;

    pool.query(query, [name, url, id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error" });
      }
      // if success return response
      res.status(200).json({
        message: "Successfully updated data",
      });
    });
  }
});

router.post("/deleteEvent", (req, res) => {
  const eventId = req.body.id; // Mendapatkan ID dari body permintaan POST

  const deleteQuery = `
    DELETE FROM app_our_partners
    WHERE id = $1
  `;

  pool.query(deleteQuery, [eventId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error deleting Partners item" });
    }
    if (result.rowCount === 1) {
      res.json({
        message: "Partners item deleted successfully",
      });
    } else {
      res.status(404).json({
        error: "Gallery item not found",
      });
    }
  });
});

module.exports = router;
