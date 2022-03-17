require("dotenv").config();
const axios = require("axios");

const BG_SERVER = process.env.BG_BACKEND;
const BG_API_KEY = process.env.BG_API_KEY;

const createUserOnBG = async userData => {
  console.log("Creating user on BG", userData.id);

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
