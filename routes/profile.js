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
    const users = await pool.query("SELECT * FROM app_contact ORDER BY id ASC");
    //   const data = users.rows[0];
    res.status(200).json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/editList", upload.single("file"), (req, res) => {
  const title = req.body.title;
  const address = req.body.address;
  const phone = req.body.phone;
  const fax = req.body.fax;
  if (req.file) {
    // Update data di tabel app_slideshow
    // name, description, image
    const query = `UPDATE app_contact
    SET title = $1,
        address = $2,
        phone = $3,
        fax = $4,
        image = $5
    WHERE id = 1`;

    pool.query(query, [title, address, phone, fax, req.file.filename], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      // if success return response
      res.json({
        message: "Successfully updated data",
      });
    });
  } else {
    // Update data di tabel app_slideshow
    const query = `UPDATE app_contact
    SET title = $1,
        address = $2,
        phone = $3,
        fax = $4
    WHERE id = 1`;

    pool.query(query, [title, address, phone, fax], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error" });
      }
      // if success return response
      res.json({
        message: "Successfully updated data",
      });
    });
  }
});
module.exports = router;
