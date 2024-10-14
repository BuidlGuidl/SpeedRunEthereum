require("dotenv").config();
const express = require("express");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const db = require("./services/db");
const { runTestsForChallenge } = require("./services/autograder");
const { withAddress, withRole } = require("./middlewares/auth");
const { getSignMessageForId, verifySignature } = require("./utils/sign");
const { EVENT_TYPES, createEvent } = require("./utils/events");
const { getChallengeIndexFromChallengeId, isAutogradingEnabledForChallenge } = require("./utils/challenges");
const eventsRoutes = require("./routes/events");
const buildsRoutes = require("./routes/builds");
const bgRoutes = require("./routes/bg");
const { trackPlausibleEvent } = require("./services/plausible");

const app = express();
const autogradingEnabled = process.env.NODE_ENV !== "test" && !!process.env.AUTOGRADING_SERVER;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/events", eventsRoutes);
app.use("/builds", buildsRoutes);
app.use("/bg", bgRoutes);

app.get("/healthcheck", (_, res) => {
  res.status(200).send("ok");
});

app.get("/sign-message", (req, res) => {
  const messageId = req.query.messageId ?? "login";
  const options = req.query;

  console.log("/sign-message", messageId);
  res.status(200).send(getSignMessageForId(messageId, options));
});

app.get("/builders", async (req, res) => {
  console.log("/builders");
  const builders = await db.findAllUsers();
  res.status(200).send(builders);
});

// TODO It looks like this route is the same as /user,
// but /user handles 404 better
app.get("/builders/:builderAddress", async (req, res) => {
  const builderAddress = req.params.builderAddress;
  console.log(`/builders/${builderAddress}`);

  const builder = await db.findUserByAddress(builderAddress);
  if (!builder.exists) {
    res.status(404).send("User doesn't exist");
    return;
  }

  res.status(200).send(builder.data);
});

app.post("/builders/update-socials", withAddress, async (request, response) => {
  const { socialLinks, signature } = request.body;
  const address = request.address;
  console.log("POST /builders/update-socials", address, socialLinks);

  const verifyOptions = {
    messageId: "builderUpdateSocials",
    address,
    socialLinks,
  };

  if (!verifySignature(signature, verifyOptions)) {
    response.status(401).send(" 🚫 Signature verification failed! Please reload and try again. Sorry! 😅");
    return;
  }

  const updatedUser = await db.updateUser(address, { socialLinks });
  response.status(200).send(updatedUser);
});

app.post("/builders/update-reached-out", withRole("admin"), async (request, response) => {
  const { reachedOut, builderAddress, signature } = request.body;
  const address = request.address;
  console.log("POST /builders/update-reached-out", address, reachedOut);

  const verifyOptions = {
    messageId: "builderUpdateReachedOut",
    address,
    reachedOut,
    builderAddress,
  };

  if (!verifySignature(signature, verifyOptions)) {
    response.status(401).send(" 🚫 Signature verification failed! Please reload and try again. Sorry! 😅");
    return;
  }

  const updatedUser = await db.updateUser(builderAddress, { reachedOut });
  response.status(200).send(updatedUser);
});

// Builder login.
app.post("/sign", async (request, response) => {
  const neededBodyProps = ["address", "signature"];
  if (neededBodyProps.some(prop => request.body[prop] === undefined)) {
    response.status(400).send(`Missing required body property. Required: ${neededBodyProps.join(", ")}`);
    return;
  }

  const signature = request.body.signature;
  const userAddress = request.body.address;
  const verifyOptions = {
    messageId: "login",
    address: userAddress,
  };

  if (!verifySignature(signature, verifyOptions)) {
    response.status(401).send(" 🚫 Signature verification failed! Please reload and try again. Sorry! 😅");
    return;
  }
  let user = await db.findUserByAddress(userAddress);

  if (!user.exists) {
    // Create user.
    const event = createEvent(EVENT_TYPES.USER_CREATE, { userAddress }, signature);
    db.createEvent(event); // INFO: async, no await here
    await db.createUser(userAddress, { creationTimestamp: new Date().getTime(), role: "registered" });
    user = await db.findUserByAddress(userAddress);

    trackPlausibleEvent("signupSRE", {}, request); // INFO: async, no await here
    console.log("New user created: ", userAddress);
  }

  response.json(user.data);
});

app.get("/user", async (request, response) => {
  const address = request.query.address;
  console.log(`/user`, address);
  const user = await db.findUserByAddress(address);
  if (!user.exists) {
    response.status(404).send("User doesn't exist");
    return;
  }

  console.log("Retrieving existing user: ", address);
  response.json(user.data);
});

app.post("/challenges/run-test", withRole("admin"), async (request, response) => {
  const { challengeId, contractUrl } = request.body;
  console.log("POST /challenges/run-test:", challengeId, contractUrl);

  try {
    const testResult = await runTestsForChallenge(challengeId, contractUrl);
    response.json(testResult);
  } catch (e) {
    response.json({ error: e.message });
  }
});

/**
 * Update the user challenges while checking trigger logic.
 */
const updateUserChallenges = async (user, challengeData) => {
  await db.updateUser(user.data.id, challengeData);
  // Trigger logic. Previous (Join the BG automation) => Now manual.
};

app.post("/challenges", withAddress, async (request, response) => {
  const { challengeId, deployedUrl, contractUrl, signature } = request.body;
  // TODO Maybe make this needed props a middleware. Same for headers
  const neededBodyProps = ["challengeId", "deployedUrl", "contractUrl", "signature"];
  if (neededBodyProps.some(prop => request.body[prop] === undefined)) {
    response.status(400).send(`Missing required body property. Required: ${neededBodyProps.join(", ")}`);
    return;
  }
  const address = request.address;
  const neededHeaders = ["address"];
  if (neededHeaders.some(prop => request.headers[prop] === undefined)) {
    response.status(400).send(`Missing required headers. Required: ${neededHeaders.join(", ")}`);
    return;
  }
  console.log("POST /challenges: ", address, challengeId, deployedUrl, contractUrl);

  const verifyOptions = {
    messageId: "challengeSubmit",
    address,
    challengeId,
  };

  let isSignatureValid;
  try {
    isSignatureValid = verifySignature(signature, verifyOptions);
  } catch (error) {
    if (error.code === "INVALID_ARGUMENT" && error.argument === "signature") {
      response.status(400).send(`Invalid signature: ${signature}`);
      return;
    }

    isSignatureValid = false;
  }

  if (!isSignatureValid) {
    response.status(401).send(" 🚫 Signature verification failed! Please reload and try again. Sorry! 😅");
    return;
  }

  const user = await db.findUserByAddress(address);
  if (!user.exists) {
    response.status(404).send("User not found!");
    return;
  }

  const existingChallenges = user.data.challenges ?? {};
  const existingReviewComment = existingChallenges[challengeId]?.reviewComment;
  // Overriding for now. We could support an array of submitted challenges.
  // ToDo. Extract challenge status (ENUM)
  existingChallenges[challengeId] = {
    status: "SUBMITTED",
    contractUrl,
    deployedUrl,
    submittedTimestamp: new Date().getTime(),
  };

  if (existingReviewComment) {
    // Keep the existing previous comment.
    existingChallenges[challengeId].reviewComment = existingReviewComment;
  }

  const eventPayload = {
    userAddress: address,
    challengeId,
    deployedUrl,
    contractUrl,
  };
  const event = createEvent(EVENT_TYPES.CHALLENGE_SUBMIT, eventPayload, signature);
  db.createEvent(event); // INFO: async, no await here
  trackPlausibleEvent("challengeSubmission", { challengeId }, request); // INFO: async, no await here

  // ToDo. Use services/autograder
  if (autogradingEnabled && isAutogradingEnabledForChallenge(challengeId)) {
    // Auto-grading
    console.log("Calling auto-grader");

    const challengeIndex = getChallengeIndexFromChallengeId(challengeId);
    const contractUrlObject = new URL(contractUrl);
    const blockExplorer = contractUrlObject.host;
    const contractAddress = contractUrlObject.pathname.replace("/address/", "");

    axios
      .post(process.env.AUTOGRADING_SERVER, {
        challenge: challengeIndex,
        blockExplorer,
        address: contractAddress,
      })
      .then(async gradingResponse => {
        // We don't wait for the auto grading to finish to return a response.
        const gradingResponseData = gradingResponse.data;
        console.log("auto-grading response data", gradingResponseData);

        if (gradingResponseData) {
          existingChallenges[challengeId].autograding = true;
          existingChallenges[challengeId].status = gradingResponseData.success ? "ACCEPTED" : "REJECTED";
          existingChallenges[challengeId].reviewComment = gradingResponseData.feedback;
        }
      })
      .catch(gradingErrorResponse => {
        const gradingErrorResponseData = gradingErrorResponse?.response?.data;

        if (gradingErrorResponseData) {
          existingChallenges[challengeId].status = "REJECTED";
          existingChallenges[challengeId].autograding = true;
          existingChallenges[challengeId].reviewComment = gradingErrorResponseData?.error;
        }

        console.error("auto-grading failed:", gradingErrorResponseData?.error);
      })
      .then(() => {
        const autogradeEventPayload = {
          reviewAction: existingChallenges[challengeId].status,
          autograding: true,
          userAddress: address,
          challengeId,
          reviewMessage: existingChallenges[challengeId].reviewComment,
        };

        const autogradeEvent = createEvent(EVENT_TYPES.CHALLENGE_AUTOGRADE, autogradeEventPayload, signature);
        db.createEvent(autogradeEvent); // INFO: async, no await here

        console.log("saving", user, existingChallenges);
        updateUserChallenges(user, { challenges: existingChallenges }); // INFO: async, no await here.
      });
  }

  await updateUserChallenges(user, { challenges: existingChallenges });
  response.sendStatus(200);
});

async function setChallengeStatus(userAddress, reviewerAddress, challengeId, newStatus, comment, signature) {
  const user = await db.findUserByAddress(userAddress);
  const existingChallenges = user.data.challenges;
  existingChallenges[challengeId] = {
    ...existingChallenges[challengeId],
    status: newStatus,
    submittedTimestamp: new Date().getTime(),
    reviewComment: comment != null ? comment : "",
  };

  const eventPayload = {
    reviewAction: newStatus,
    userAddress,
    reviewerAddress,
    challengeId,
    reviewMessage: comment ?? "",
  };
  const event = createEvent(EVENT_TYPES.CHALLENGE_REVIEW, eventPayload, signature);
  db.createEvent(event); // INFO: async, no await here

  const updateData = {
    challenges: existingChallenges,
  };

  // ToDo. Role and Status from ENUM / constants
  if ((!user.data.role || user.data.role === "registered") && newStatus === "ACCEPTED") {
    updateData.role = "builder";
  }

  await updateUserChallenges(user, updateData);
}

app.patch("/challenges", withRole("admin"), async (request, response) => {
  const { userAddress, challengeId, newStatus, comment, signature } = request.body;
  const neededBodyProps = ["userAddress", "challengeId", "newStatus", "comment", "signature"];
  if (neededBodyProps.some(prop => request.body[prop] === undefined)) {
    console.log(
      "[400] POST /challenges",
      Object.entries({ userAddress, challengeId, newStatus, comment, signature }).join(", "),
    );
    response.status(400).send(`Missing required body property. Required: ${neededBodyProps.join(", ")}`);
    return;
  }
  const address = request.address;
  const neededHeaders = ["address"];
  if (neededHeaders.some(prop => request.headers[prop] === undefined)) {
    response.status(400).send(`Missing required headers. Required: ${neededHeaders.join(", ")}`);
    return;
  }

  const verifyOptions = {
    messageId: "challengeReview",
    address,
    userAddress,
    challengeId,
    newStatus,
  };

  if (!verifySignature(signature, verifyOptions)) {
    response.status(401).send(" 🚫 Signature verification failed! Please reload and try again. Sorry! 😅");
    return;
  }

  if (newStatus !== "ACCEPTED" && newStatus !== "REJECTED") {
    response.status(400).send("Invalid status");
  } else {
    await setChallengeStatus(userAddress, address, challengeId, newStatus, comment, signature);
    response.sendStatus(200);
  }
});

app.get("/challenges", withRole("admin"), async (request, response) => {
  console.log("GET /challenges");
  const status = request.query.status;
  const allChallenges = await db.getAllChallenges();
  if (status == null) {
    response.json(allChallenges);
  } else {
    response.json(allChallenges.filter(({ status: challengeStatus }) => challengeStatus === status));
  }
});

app.post("/api/frame", (req, res) => {
  const baseUrl = "https://speedrunethereum.com";
  const SRE_BACKEND = "https://scaffold-directory-dev.ew.r.appspot.com";

  const challengeButtons = {
    0: {
      label: "🎟 Simple NFT Example",
      link: "https://speedrunethereum.com/challenge/simple-nft-example",
    },
    1: {
      label: "🔏 Staking App",
      link: "https://speedrunethereum.com/challenge/decentralized-staking",
    },
    2: {
      label: "🏵 Token Vendor",
      link: "https://speedrunethereum.com/challenge/token-vendor",
    },
    3: {
      label: "🎲 Dice Game",
      link: "https://speedrunethereum.com/challenge/dice-game",
    },
    4: {
      label: "⚖️ Build a DEX",
      link: "https://speedrunethereum.com/challenge/minimum-viable-exchange",
    },
    5: {
      label: "📺 State Channel App",
      link: "https://speedrunethereum.com/challenge/state-channels",
    },
  };

  try {
    const { query } = req;

    let idAsNumber = 0;

    if (query && query.id) {
      idAsNumber = Number(query.id);
    }

    const nextId = idAsNumber + 1;

    if (idAsNumber === 6) {
      res.status(200).send(`<!DOCTYPE html><html><head>
      <title>Speed Run Ethereum</title>
      <meta property="og:image" content="${baseUrl}/frames/buidlguidl.jpg" />
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${baseUrl}/frames/buidlguidl.jpg" />
      <meta property="fc:frame:button:1" content="🛠️ GitHub" />
      <meta property="fc:frame:button:1:action" content="link" />
      <meta property="fc:frame:button:1:target" content="https://github.com/scaffold-eth/se-2-challenges" />
      <meta property="fc:frame:button:2" content="🏰 BuidlGuidl" />
      <meta property="fc:frame:button:2:action" content="link" />
      <meta property="fc:frame:button:2:target" content="https://buidlguidl.com/" />
      <meta property="fc:frame:button:3" content="💬 Telegram" />
      <meta property="fc:frame:button:3:action" content="link" />
      <meta property="fc:frame:button:3:target" content="https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA" />
      </head></html>`);
    } else {
      res.status(200).send(`<!DOCTYPE html><html><head>
        <title>Speed Run Ethereum</title>
        <meta property="og:image" content="${baseUrl}/frames/challenge-${idAsNumber}.png" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/frames/challenge-${idAsNumber}.png" />
        <meta property="fc:frame:button:1" content="${challengeButtons[idAsNumber].label}" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${challengeButtons[idAsNumber].link}" />
        <meta property="fc:frame:button:2" content="Next →" />
        <meta property="fc:frame:post_url" content="${SRE_BACKEND}/api/frame?id=${nextId}" />
      </head></html>`);
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ error: "failed to load frame" });
  }
});

// If nothing processed the request, return 404
app.use((req, res) => {
  console.log(`Request to ${req.path} resulted in 404`);
  res.status(404).json({ error: "not found" });
});

const PORT = process.env.PORT || 49832;

if (process.env.NODE_ENV !== "test") {
  if (fs.existsSync("server.key") && fs.existsSync("server.cert")) {
    https
      .createServer(
        {
          key: fs.readFileSync("server.key"),
          cert: fs.readFileSync("server.cert"),
        },
        app,
      )
      .listen(PORT, () => {
        console.log(`HTTPS Listening: ${PORT}`);
      });
  } else {
    const server = app.listen(PORT, () => {
      console.log("HTTP Listening on port:", server.address().port);
    });
  }
}

module.exports = app; // INFO: needed for testing
