const express = require("express");
const db = require("../services/db");
const { verifySignature } = require("../utils/sign");
const { EVENT_TYPES, createEvent } = require("../utils/events");
const { createUserOnBG } = require("../services/buidlguidl");

const router = express.Router();

/**
 * Join the BG
 */
router.post("/join", async (request, response) => {
  console.log("POST /bg/join");
  const { signature } = request.body;
  const address = request.address;

  const verifyOptions = {
    messageId: "bgJoin",
    address,
  };

  if (!verifySignature(signature, verifyOptions)) {
    response.status(401).send(" 🚫 Signature verification failed! Please reload and try again. Sorry! 😅");
    return;
  }

  // Check
  try {
    await createUserOnBG(address);
  } catch (e) {
    console.log("Builder cant join the BG", e);
    response.status(403).send(e.toString());
    return;
  }

  const eventPayload = {
    userAddress: address,
  };

  const event = createEvent(EVENT_TYPES.BG_JOIN, eventPayload, signature);
  db.createEvent(event); // INFO: async, no await here

  response.sendStatus(200);
});

module.exports = router;
