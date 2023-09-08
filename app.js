// app.js

const express = require('express');
const serverless = require("serverless-http");
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors'); // Import middleware CORS
const port = 3000; // Port

app.use(cors())
app.use(express.json());
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(express.static('public'));

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


module.exports = app;
module.exports.handler = serverless(app);