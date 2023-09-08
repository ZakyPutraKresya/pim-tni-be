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
app.use('/users', usersRoute);
app.use("/auth", authRoute)
// Rute untuk akar domain
app.get('/', (req, res) => {
  res.send('Hello from the Express API at the root domain!');
});

// // Jalankan server
// app.listen(port, () => {
//   console.log(`Server berjalan di http://localhost:${port}`);
// });


module.exports = app;
module.exports.handler = serverless(app);