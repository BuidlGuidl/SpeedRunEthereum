const express = require("express");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./services/db");
const { withAddress } = require("./middlewares/auth");
const { getSignMessageForId, verifySignature } = require("./utils/sign");

const adminOnly = (req, res, next) => {
  // should be done in #51 https://github.com/moonshotcollective/scaffold-directory/issues/51
  console.log("!! SKIPPING ADMIN CHECKS. THIS SHOULD BE FIXED IN #51");
  next();
};

const app = express();

const dummyData = {
  challenges: {
    "simple-nft-example": {
      status: "ACCEPTED",
      url: "example.com",
    },
    "decentralized-staking": {
      status: "SUBMITTED",
      url: "example2.com",
    },
  },
};

/*
  Uncomment this if you want to create a wallet to send ETH or something...
const INFURA = JSON.parse(fs.readFileSync("./infura.txt").toString().trim())
const PK = fs.readFileSync("./pk.txt").toString().trim()
let wallet = new ethers.Wallet(PK,new ethers.providers.InfuraProvider("goerli",INFURA))
console.log(wallet.address)
const checkWalletBalance = async ()=>{
  console.log("BALANCE:",ethers.utils.formatEther(await wallet.provider.getBalance(wallet.address)))
}
checkWalletBalance()
*/

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get("/builders/:builderAddress", async (req, res) => {
  const builderAddress = req.params.builderAddress;
  console.log(`/builders/${builderAddress}`);

  const builder = await db.findUserByAddress(builderAddress);
  res.status(200).send(builder.data);
});

app.post("/sign", async (request, response) => {
  const ip = request.headers["x-forwarded-for"] || request.connection.remoteAddress;
  console.log("POST from ip address:", ip, request.body.message);

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
  const user = await db.findUserByAddress(userAddress);

  if (!user.exists) {
    // Create user.
    await db.createUser(userAddress, dummyData);
    console.log("New user created: ", userAddress);
  }

  const isAdmin = user.data.isAdmin ?? false;

  response.json({ isAdmin });
});

app.get("/user", async (request, response) => {
  const address = request.query.address;
  console.log(`/user`, address);
  const user = await db.findUserByAddress(address);
  if (!user.exists) {
    // It should never happen, but just in case...
    response.status(401).send("Something went wrong. Cant find the user in the database");
    return;
  }

  console.log("Retrieving existing user: ", address);
  response.json(user.data);
});

app.post("/challenges", withAddress, async (request, response) => {
  const { challengeId, deployedUrl, branchUrl, signature } = request.body;
  const address = request.address;
  console.log("POST /challenges: ", address, challengeId, deployedUrl, branchUrl);

  const verifyOptions = {
    messageId: "challengeSubmit",
    address,
    challengeId,
  };

  if (!verifySignature(signature, verifyOptions)) {
    response.status(401).send(" 🚫 Signature verification failed! Please reload and try again. Sorry! 😅");
    return;
  }

  const user = await db.findUserByAddress(address);
  if (!user.exists) {
    response.status(404).send("User not found!");
    return;
  }

  const existingChallenges = user.data.challenges;
  // Overriding for now. We could support an array of submitted challenges.
  // ToDo. Extract challenge status (ENUM)
  existingChallenges[challengeId] = {
    status: "SUBMITTED",
    branchUrl,
    deployedUrl,
  };
  await db.updateUser(address, { challenges: existingChallenges });
  response.sendStatus(200);
});

async function setChallengeStatus(userAddress, challengeId, newStatus, comment) {
  const user = await db.findUserByAddress(userAddress);
  const existingChallenges = user.data.challenges;
  existingChallenges[challengeId] = {
    ...existingChallenges[challengeId],
    status: newStatus,
    reviewComment: comment != null ? comment : "",
  };
  await db.updateUser(userAddress, { challenges: existingChallenges });
}

app.patch("/challenges", adminOnly, async (request, response) => {
  const { userAddress, challengeId, newStatus, comment, signature } = request.body.params;
  const address = request.address;

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
    await setChallengeStatus(userAddress, challengeId, newStatus, comment);
    response.sendStatus(200);
  }
});

// ToDo: This is very inefficient,´. We fetch the whole database every time we call this.
// We should create a getChallengesByStatus function that fetches the challenges by status.
// https://github.com/moonshotcollective/scaffold-directory/pull/32#discussion_r711971355
async function getAllChallenges() {
  // const usersDocs = (await database.collection("users").get()).docs;
  const usersData = await db.findAllUsers();
  const allChallenges = usersData.reduce((challenges, userData) => {
    const userChallenges = userData.challenges;
    const userUnpackedChallenges = Object.keys(userChallenges).map(challengeKey => ({
      userAddress: userData.id,
      id: challengeKey,
      ...userChallenges[challengeKey],
    }));
    return challenges.concat(userUnpackedChallenges);
  }, []);

  return allChallenges;
}

app.get("/challenges", adminOnly, async (request, response) => {
  const status = request.query.status;
  const allChallenges = await getAllChallenges();
  if (status == null) {
    response.json(allChallenges);
  } else {
    response.json(allChallenges.filter(({ status: challengeStatus }) => challengeStatus === status));
  }
});

app.get("/auth-jwt-restricted", withAddress, (req, res) => {
  res.send(`all working! 👌. Successfully authenticated request from ${req.address}`);
});

app.get("/auth-jwt-admin-restricted", adminOnly, (req, res) => {
  res.send(`all working! 👌. Successfully authenticated request from ${req.address}`);
});

if (fs.existsSync("server.key") && fs.existsSync("server.cert")) {
  https
    .createServer(
      {
        key: fs.readFileSync("server.key"),
        cert: fs.readFileSync("server.cert"),
      },
      app,
    )
    .listen(49832, () => {
      console.log("HTTPS Listening: 49832");
    });
} else {
  const server = app.listen(49832, () => {
    console.log("HTTP Listening on port:", server.address().port);
  });
}
