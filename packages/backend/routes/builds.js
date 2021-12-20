const express = require("express");
const db = require("../services/db");
const { verifySignature } = require("../utils/sign");
const { EVENT_TYPES, createEvent } = require("../utils/events");
const { withRole } = require("../middlewares/auth");

const router = express.Router();

/**
 * Get all Builds.
 */
router.get("/", async (req, res) => {
  console.log("/builds");
  const isDraft = req.query.isDraft;
  const allBuilds = await db.findAllBuilds(isDraft);
  res.json(allBuilds);
});

/**
 * Create a new build in draft mode
 */
router.post("/", withRole("builder"), async (request, response) => {
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

  const buildData = {
    branch: buildUrl,
    desc,
    image,
    name,
    address,
    submittedTimestamp: new Date().getTime(),
    isDraft: true,
  };

  const dbResponse = await db.createBuild(buildData);

  const eventPayload = {
    userAddress: address,
    buildUrl,
    name,
    buildId: dbResponse.id,
  };

  const event = createEvent(EVENT_TYPES.BUILD_SUBMIT, eventPayload, signature);
  db.createEvent(event); // INFO: async, no await here

  response.sendStatus(200);
});

/**
 * Publish / Delete a build
 */
router.patch("/", withRole("admin"), async (request, response) => {
  console.log("PATCH /builds");
  const { buildId, newStatus, signature, userAddress } = request.body;
  const address = request.address;

  const verifyOptions = {
    messageId: "buildReview",
    address,
    buildId,
    newStatus,
  };

  if (!verifySignature(signature, verifyOptions)) {
    response.status(401).send(" 🚫 Signature verification failed! Please reload and try again. Sorry! 😅");
    return;
  }

  if (newStatus !== "ACCEPTED" && newStatus !== "REJECTED") {
    response.status(400).send("Invalid status");
    return;
  }

  if (newStatus === "ACCEPTED") {
    await db.publishBuild(buildId);
  } else if (newStatus === "REJECTED") {
    await db.removeBuild(buildId);
  }

  const eventPayload = {
    reviewAction: newStatus,
    userAddress,
    reviewerAddress: address,
    buildId,
  };
  const event = createEvent(EVENT_TYPES.BUILD_REVIEW, eventPayload, signature);
  db.createEvent(event); // INFO: async, no await here

  response.sendStatus(200);
});

module.exports = router;
