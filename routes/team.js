const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/list", async (req, res) => {
    try {
      const users = await pool.query("SELECT * FROM app_our_team");
    //   const data = users.rows[0];
      res.status(200).json(users.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

module.exports = router