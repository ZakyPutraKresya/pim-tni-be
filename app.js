// app.js

const express = require('express');
const serverless = require("serverless-http");
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors'); // Import middleware CORS
const port = 8080; // Port
const path = require('path');
const pool = require("./db");
const multer = require("multer");

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

app.use(cors());

app.use(express.json());

// for parsing application/xwww-
app.use(express.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(express.static(path.join(__dirname, 'public')));

// Rute-rute API pengguna
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const imagesRoute = require('./routes/images');
const aboutRoute = require('./routes/about');
const teamRoute = require('./routes/team');
const eventRoute = require('./routes/events');
const galleryRoute = require('./routes/gallery');
app.use('/users', usersRoute);
app.use("/auth", authRoute);
app.use("/images", imagesRoute);
app.use("/about", aboutRoute);
app.use("/team", teamRoute);
app.use("/event", eventRoute);
app.use("/gallery", galleryRoute);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Pusat Informasi Maritim API' });
});

app.get("/dashboard", async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT * FROM app_welcome_title"
    );
    res.json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/dashboard", upload.single('file'), (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  if (!req.file){
    const query = `
    UPDATE app_welcome_title
    SET title = $1,
        description = $2
    WHERE id = 1
  `;

    pool.query(query, [title, description], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.json({
        message: "Successfully updated data."
      });
    });
  } else {
    const filename = "/uploads/" + req.file.filename; // Nama file yang diunggah

    const query = `
        UPDATE app_welcome_title
        SET title = $1,
            description = $2,
            image = $3
        WHERE id = 1
      `;

    pool.query(query, [title, description, filename], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.json({
        message: "Successfully updated data."
      });
    });
  }
});
app.use((req, res, next) => {
  res.status(500).json({ message: 'Route not found'})
});


app.listen(port, (req, res) => {
  console.log("Running on port " + port)
})


module.exports = app;
module.exports.handler = serverless(app);