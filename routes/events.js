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
        "SELECT * FROM app_events ORDER BY id DESC"
      );
      res.json(users.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  router.post("/createList", upload.single("file"), (req, res) => {
    // Dapatkan data 'title' dari FormData
    const title = req.body.title;
    const description = req.body.description;
    const date = req.body.event_date;
    
    if (req.file) {
      // Update data di tabel app_slideshow
      const slideshowQuery = `
        INSERT INTO app_events (title, description, image, event_date) VALUES ($1, $2, $3, $4)
      `;
  
      pool.query(slideshowQuery, [title, description, req.file.filename, date], (err, result) => {
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
    INSERT INTO app_events (title, description, event_date) VALUES ($1, $2, $3)
  `;
      pool.query(slideshowQuery, [title, description, date], (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Error" });
        }
        // if success return response
        res.json({
          message: "Successfully insert data",
        });
      });
    }
  });
  router.post("/editList", upload.single("file"), (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const id = req.body.id;
    const date = req.body.event_date;
    if (req.file) {
      // Update data di tabel app_slideshow
      // name, description, image
      const query = `UPDATE app_events
      SET title = $1,
          description = $2,
          image = $3,
          event_date = $4
      WHERE id = $5`;
  
      pool.query(query, [title, description, req.file.filename, date, id], (err, result) => {
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
      const query = `UPDATE app_events
      SET title = $1,
          description = $2,
          event_date = $3
      WHERE id = $4`;
  
      pool.query(query, [title, description, date, id], (err, result) => {
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
      DELETE FROM app_events
      WHERE id = $1
    `;
  
    pool.query(deleteQuery, [eventId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error deleting event" });
      }
      if (result.rowCount === 1) {
        res.json({
          message: "Event deleted successfully",
        });
      } else {
        res.status(404).json({
          error: "Event not found",
        });
      }
    });
  });

  router.get("/newest", async (req, res) => {
    try {
      const users = await pool.query(
        "SELECT * FROM app_events ORDER BY id DESC limit 6"
      );
      res.json(users.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })



  module.exports = router;
