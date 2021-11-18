const express = require("express");
const db = require("../services/db");
const { verifySignature } = require("../utils/sign");
const { EVENT_TYPES, createEvent } = require("../utils/events");

const router = express.Router();

/**
 * Get all Builds.
 */
router.get("/", async (req, res) => {
  console.log("/builds");
  const allBuilds = await db.findAllBuilds();
  res.json(allBuilds);
});

/**
 * Create a new build in draft mode
 */
router.post("/", async (request, response) => {
  console.log("POST /builds");
  const { buildUrl, desc, image, name, signature } = request.body;
  const address = request.address;

  const verifyOptions = {
    messageId: "buildSubmit",
    address,
    buildUrl,
  };

  if (!verifySignature(signature, verifyOptions)) {
    response.status(401).send(" 🚫 Signature verification failed! Please reload and try again. Sorry! 😅");
    return;
  }

  const eventPayload = {
    userAddress: address,
    buildUrl,
    name,
  };
  const event = createEvent(EVENT_TYPES.BUILD_CREATE, eventPayload, signature);
  db.createEvent(event); // INFO: async, no await here

  const buildData = {
    branch: buildUrl,
    desc,
    image,
    name,
    address,
    isDraft: true,
  };

  await db.createBuild(buildData);
  response.sendStatus(200);
});

module.exports = router;
