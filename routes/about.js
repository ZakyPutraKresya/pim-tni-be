const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/foreword", (req, res) => {
  const { title, description, author_name, author_position } = req.body;

  const query = `UPDATE app_foreword
    SET title = $1,
        description = $2,
        author_name = $3,
        author_position = $4
    WHERE id = 1`;
  pool.query(
    query,
    [title, description, author_name, author_position],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Gagal melakukan update data " });
      }
      // if success return response
      res.status(200).json({
        message: "Successfully updated data",
      });
    }
  );
});
router.get("/foreword", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM app_foreword");
    const data = users.rows[0];
    res.status(200).json([{
        title: data.title,
        paragraphs: data.description,
        author: {
            name: data.author_name,
            position: data.author_position
        }
    }]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/mission", (req, res) => {
  const { title, description } = req.body;

  const query = `UPDATE app_mission_about
    SET title = $1,
        description = $2
    WHERE id = 1`;
  pool.query(
    query,
    [title, description],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Gagal melakukan update data " });
      }
      // if success return response
      res.status(200).json({
        message: "Successfully updated data",
      });
    }
  );
});
router.get("/mission", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM app_mission_about");
    const data = users.rows[0];
    res.status(200).json([{
        title: data.title,
        description: data.description
    }]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/vision", (req, res) => {
  const { title, description } = req.body;

  const query = `UPDATE app_vision_about
    SET title = $1,
        description = $2
    WHERE id = 1`;
  pool.query(
    query,
    [title, description],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Gagal melakukan update data " });
      }
      // if success return response
      res.status(200).json({
        message: "Successfully updated data",
      });
    }
  );
});
router.get("/vision", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM app_vision_about");
    const data = users.rows[0];
    res.status(200).json([{
        title: data.title,
        description: data.description
    }]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/description", (req, res) => {
  const { title, description } = req.body;

  const query = `UPDATE app_description_about
    SET title = $1,
        description = $2
    WHERE id = 1`;
  pool.query(
    query,
    [title, description],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Gagal melakukan update data " });
      }
      // if success return response
      res.status(200).json({
        message: "Successfully updated data",
      });
    }
  );
});
router.get("/description", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM app_description_about");
    const data = users.rows[0];
    res.status(200).json([{
        title: data.title,
        description: data.description
    }]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
