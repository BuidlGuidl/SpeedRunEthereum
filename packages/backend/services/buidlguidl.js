require("dotenv").config();
const axios = require("axios");

const BG_SERVER = process.env.BG_BACKEND;
const BG_API_KEY = process.env.BG_API_KEY;

const createUserOnBG = async userAddress => {
  console.log("Creating user on BG", userAddress);

  return axios
    .post(
      `${BG_SERVER}/api/builders/create`,
      {
        builderAddress: userAddress,
      },
      {
        headers: {
          apikey: BG_API_KEY,
        },
      },
    )
    .then(() => {
      console.log("User created on BGv3!");
    })
    .catch(e => {
      console.error("BG user creation failed:", e);
      throw new Error(`BG user creation failed: ${e}`);
    });
};

module.exports = {
  createUserOnBG,
};
