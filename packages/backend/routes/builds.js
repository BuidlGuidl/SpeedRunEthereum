const express = require("express");
const db = require("../services/db");

const router = express.Router();

/**
 * Get all Builds.
 */
router.get("/", async (req, res) => {
  console.log("/builds");
  const allBuilds = await db.findAllBuilds();
  res.json(allBuilds);
});

module.exports = router;
