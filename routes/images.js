const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const timestamp = Math.floor(Date.now() / 1000);
    const imageName = `${timestamp}_${file.originalname}`;
    cb(null, imageName);
  },
});
const upload = multer({ storage });

router.get("/slideshow", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM app_slideshow");
    res.json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/upload", upload.single("image"), (req, res) => {
  res.status(200).json({ message: "Image uploaded successfully" });
});

module.exports = router;
