const ethers = require("ethers");
const express = require("express");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const bodyParser = require("body-parser");
// Firebase set up
const firebaseAdmin = require("firebase-admin");
const firebaseServiceAccount = require("./firebaseServiceAccountKey.json");
const { jwtAuth } = require("./middlewares/auth");

const app = express();

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
});
// Docs: https://firebase.google.com/docs/firestore/quickstart#node.js_1
const database = firebaseAdmin.firestore();

const currentMessage = "I am **ADDRESS** and I would like to sign in to Scaffold-Directory, plz!";

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
  console.log("/sign-message");
  res.status(200).send(currentMessage);
});

app.get("/builders", async (req, res) => {
  console.log("/builders");
  const buildersSnapshot = await database.collection("users").get();
  res.status(200).send(buildersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
});

app.get("/builders/:builderAddress", async (req, res) => {
  const builderAddress = req.params.builderAddress;
  console.log(`/builders/${builderAddress}`);

  const builderSnapshot = await database.collection("users").doc(builderAddress).get();
  res.status(200).send({ id: builderSnapshot.id, ...builderSnapshot.data() });
});

app.post("/sign", async (request, response) => {
  const ip = request.headers["x-forwarded-for"] || request.connection.remoteAddress;
  console.log("POST from ip address:", ip, request.body.message);
  if (request.body.message !== currentMessage.replace("**ADDRESS**", request.body.address)) {
    response.send(" ⚠️ Secret message mismatch!?! Please reload and try again. Sorry! 😅");
  } else {
    const recovered = ethers.utils.verifyMessage(request.body.message, request.body.signature);
    const userAddress = request.body.address;
    if (recovered === userAddress) {
      // we now know that the current user is th one that signed and sent this message
      const user = await database.collection("users").doc(userAddress).get();
      let userObject = {};
      if (!user.exists) {
        // Create user.
        const userRef = database.collection("users").doc(userAddress);
        await userRef.set(dummyData);
        console.log("New user created: ", userAddress);
        userObject = dummyData;
      } else {
        // Retrieve existing user.
        console.log("Retrieving existing user: ", userAddress);
        userObject = user.data();
      }

      // TODO get isAdmin from the userObject
      const jwt = await firebaseAdmin.auth().createCustomToken(recovered, { isAdmin: false });

      response.json({ ...userObject, token: jwt });
    } else {
      response.status(401).send(" 🚫 Signature verification failed! Please reload and try again. Sorry! 😅");
    }
  }
});

app.post("/challenges", async (request, response) => {
  // ToDo. Auth / Validate route. https://github.com/moonshotcollective/scaffold-directory/issues/18
  const { challengeId, deployedUrl, branchUrl, address } = request.body;
  console.log("POST /challenges: ", address, challengeId, deployedUrl, branchUrl);

  const userRef = await database.collection("users").doc(address);
  const user = await userRef.get();
  if (user.exists) {
    const existingChallenges = user.get("challenges");
    // Overriding for now. We could support an array of submitted challenges.
    // ToDo. Extract challenge status (ENUM)
    existingChallenges[challengeId] = {
      status: "SUBMITTED",
      branchUrl,
      deployedUrl,
    };
    await userRef.set({ challenges: existingChallenges });
    response.sendStatus(200);
  } else {
    response.status(404).send("User not found!");
  }
});

app.get("/auth-jwt-restricted", jwtAuth, (req, res) => {
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
