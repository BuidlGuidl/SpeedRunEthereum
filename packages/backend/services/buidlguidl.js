require("dotenv").config();
const axios = require("axios");
const db = require("./db");
const { trackPlausibleEvent } = require("./plausible");

const BG_SERVER = process.env.BG_BACKEND;
const BG_API_KEY = process.env.BG_API_KEY;

const createUserOnBG = async (userAddress, request) => {
  console.log("Creating user on BG", userAddress);

  const user = await db.findUserByAddress(userAddress);
  if (!user.exists) {
    throw new Error("Builder doesn't exist");
  }

  if (user.joinedBg) {
    throw new Error("Builder already on BuidlGuidl");
  }

  await db.markAsBuidlGuidlMember(userAddress);

  const userData = user.data;
  const requiredChallengesToEnterBG = ["simple-nft-example", "decentralized-staking", "token-vendor", "dice-game"];
  const arePendingChallenges = requiredChallengesToEnterBG.some(
    challengeId => userData.challenges?.[challengeId]?.status !== "ACCEPTED",
  );

  if (arePendingChallenges) {
    throw new Error("Builder has pending challenges");
  }

  const payload = {
    builderAddress: userData.id,
  };

  if (userData.socialLinks && Object.keys(userData.socialLinks).length !== 0) {
    payload.existingBuilderData = {
      socialLinks: {
        ...userData.socialLinks,
      },
    };
  }

  return axios
    .post(`${BG_SERVER}/api/builders/create`, payload, {
      headers: {
        apikey: BG_API_KEY,
      },
    })
    .then(response => {
      if (response.status === 204) {
        console.log(`User ${userData.id} already existed on BGv3`);
      } else {
        console.log(`User ${userData.id} created on BGv3!`);
        trackPlausibleEvent("joinBG", {}, request); // INFO: async, no await here
      }
    })
    .catch(e => {
      console.error("BG user creation failed:", e);
      throw new Error(`BG user creation failed: ${e}`);
    });
};

module.exports = {
  createUserOnBG,
};
