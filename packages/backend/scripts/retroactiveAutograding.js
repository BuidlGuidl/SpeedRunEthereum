require("dotenv").config();
const axios = require("axios");
const db = require("../services/db");
const { getChallengeIndexFromChallengeId, isAutogradingEnabledForChallenge } = require("../utils/challenges");

(async () => {
  const allChallenges = await db.getAllChallenges();
  const pendingChallenges = allChallenges.filter(({ status: challengeStatus }) => challengeStatus === "SUBMITTED");

  // eslint-disable-next-line no-restricted-syntax
  for (const challenge of pendingChallenges) {
    if (isAutogradingEnabledForChallenge(challenge.id)) {
      console.log("\n\nCalling auto-grading on");
      console.log(challenge);

      // eslint-disable-next-line no-await-in-loop
      const user = await db.findUserByAddress(challenge.userAddress);
      console.log("\nuser", user);

      const existingChallenges = user.data.challenges ?? {};

      // Auto-grading
      const challengeIndex = getChallengeIndexFromChallengeId(challenge.id);
      const contractUrlObject = new URL(challenge.contractUrl);
      const network = contractUrlObject.host.split(".")[0];
      const contractAddress = contractUrlObject.pathname.replace("/address/", "");

      // eslint-disable-next-line no-await-in-loop
      await axios
        .post(process.env.AUTOGRADING_SERVER, {
          challenge: challengeIndex,
          network,
          address: contractAddress,
        })
        .then(gradingResponse => {
          // We don't wait for the auto grading to finish to return a response.
          const gradingResponseData = gradingResponse.data;
          console.log("auto-grading response data", gradingResponseData);

          if (gradingResponseData) {
            existingChallenges[challenge.id].status = gradingResponseData.success ? "ACCEPTED" : "REJECTED";
            existingChallenges[challenge.id].reviewComment = gradingResponseData.feedback;
            existingChallenges[challenge.id].autograding = true;
          }

          // ToDo. Uncomment when ready.
          // db.updateUser(challenge.userAddress, { challenges: existingChallenges });
        })
        .catch(error => {
          console.error("auto-grading failed", error);
        });
    }
  }
})();
