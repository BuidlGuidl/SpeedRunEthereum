/**
 * Create builders on BGv3 that have completed
 * the first two challenges in SRE.
 */

require("dotenv").config();
const firebaseAdmin = require("firebase-admin");
const { createUserOnBG } = require("../services/buidlguidl");

if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(),
  });
} else {
  firebaseAdmin.initializeApp();
}

// Docs: https://firebase.google.com/docs/firestore/quickstart#node.js_1
const database = firebaseAdmin.firestore();

const main = async () => {
  const result = await database
    .collection("users")
    .where("challenges.simple-nft-example.status", "==", "ACCEPTED")
    .where("challenges.decentralized-staking.status", "==", "ACCEPTED")
    .where("challenges.token-vendor.status", "==", "ACCEPTED")
    .get();

  result.forEach(builder => {
    console.log("Creating user", builder.id, "on BG");
    createUserOnBG(builder.id);
  });
};

main();
