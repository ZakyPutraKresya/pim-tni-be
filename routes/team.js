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

router.get("/list", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM app_our_team ORDER BY id ASC");
    //   const data = users.rows[0];
    res.status(200).json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/header", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM app_header_team");
    //   const data = users.rows[0];
    res.status(200).json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/createList", upload.single("file"), (req, res) => {
  // Dapatkan data 'name' dari FormData
  const name = req.body.name;
  const description = req.body.description;
  if (req.file) {
    // Update data di tabel app_slideshow
    const slideshowQuery = `
      INSERT INTO app_our_team (name, description, image) VALUES ($1, $2, $3)
    `;

    pool.query(slideshowQuery, [name, description, req.file.filename], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      // if success return response
      res.json({
        message: "Successfully insert data",
      });
    });
  } else {
    // Update data di tabel app_slideshow
    const slideshowQuery = `
  INSERT INTO app_our_team (name, description) VALUES ($1, $2)
`;

    pool.query(slideshowQuery, [name, description], (err, result) => {
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
router.post("/editList", upload.single("file"), (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const id = req.body.id;
  if (req.file) {
    // Update data di tabel app_slideshow
    // name, description, image
    const query = `UPDATE app_our_team
    SET name = $1,
        description = $2,
        image = $3
    WHERE id = $4`;

    pool.query(query, [name, description, req.file.filename, id], (err, result) => {
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
    const query = `UPDATE app_our_team
    SET name = $1,
        description = $2
    WHERE id = $3`;

    pool.query(query, [name, description, id], (err, result) => {
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

router.post("/createTitle", upload.single("file"), (req, res) => {
  const title = req.body.title;
  if (req.file) {
    // Update data di tabel app_slideshow

    const query = `UPDATE app_header_team
    SET title = $1,
        image = $2
    WHERE id = 1`;

    pool.query(query, [title, req.file.filename], (err, result) => {
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
    const query = `UPDATE app_header_team
    SET title = $1
    WHERE id = 1`;

    pool.query(query, [title], (err, result) => {
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

router.post("/deleteEvent", (req, res) => {
  const eventId = req.body.id; // Mendapatkan ID dari body permintaan POST

  const deleteQuery = `
    DELETE FROM app_our_team
    WHERE id = $1
  `;

  pool.query(deleteQuery, [eventId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error deleting list" });
    }
    if (result.rowCount === 1) {
      res.json({
        message: "Our Team Item deleted successfully",
      });
    } else {
      res.status(404).json({
        error: "Our Team Item not found",
      });
    }
  });
});

module.exports = router;
