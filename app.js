// app.js

const express = require('express');
const serverless = require("serverless-http");
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors'); // Import middleware CORS
const port = 2900; // Port
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


app.use(cors())
app.use(express.json());
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(express.static(path.join(__dirname, 'public')));

// Rute-rute API pengguna
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const imagesRoute = require('./routes/images');
app.use('/users', usersRoute);
app.use("/auth", authRoute);
app.use("/images", imagesRoute)
// Rute untuk akar domain
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

app.post("/dashboard", upload.single("file"), (req, res) => {
  // if (!req.file) {
  //   return res.status(400).json({ error: "Tidak ada file yang diunggah" });
  // }

  // Dapatkan data 'author' dari FormData
  const title = req.body.title;
  const description = req.body.description;
  const filename = "/uploads/" + req.file.filename; // Nama file yang diunggah

  // Update data di tabel app_slideshow
  const query = `
      UPDATE app_welcome_title
      SET title = $1,
          description = $2,
      WHERE id = 1
    `;

  // Ganti $1, $2, dan $3 dengan nilai yang sesuai
  pool.query(query, [title, description], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Gagal melakukan update data " });
    }

    // Jika query update berhasil, kirim respons sukses
    res.json({
      message: "File berhasil diunggah dan informasi diupdate",
    });
  });
});
app.use((req, res, next) => {
  res.status(500).json({ message: 'Route not found'})
});


app.listen(port, (req, res) => {
  console.log("Running on port " + port)
})


module.exports = app;
module.exports.handler = serverless(app);