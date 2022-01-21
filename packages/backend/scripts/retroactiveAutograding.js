require("dotenv").config();
const axios = require("axios");
const db = require("../services/db");
const { getChallengeIndexFromChallengeId, isAutogradingEnabledForChallenge } = require("../utils/challenges");

let acceptedChallenges = 0;
let rejectedChallenges = 0;
let autograderErrors = 0;

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
        .then(async gradingResponse => {
          // We don't wait for the auto grading to finish to return a response.
          const gradingResponseData = gradingResponse.data;
          console.log("auto-grading response data", gradingResponseData);

          if (gradingResponseData) {
            existingChallenges[challenge.id].reviewComment = gradingResponseData.feedback;
            existingChallenges[challenge.id].autograding = true;

            // For now just auto-grade accepted submissions, so rejections will always be manually reviewed by graders.
            // We store the autograder feedback.
            if (gradingResponseData.success) {
              console.log("✔️ Accepted!");
              existingChallenges[challenge.id].status = "ACCEPTED";
              acceptedChallenges += 1;
            } else {
              console.log("❌ Rejected!");
              rejectedChallenges += 1;
            }
          }
        })
        .catch(gradingErrorResponse => {
          const gradingErrorResponseData = gradingErrorResponse?.response?.data;

          // We don't change the status of the submission, just leave the error for the manual graders to see.
          if (gradingErrorResponseData) {
            existingChallenges[challenge.id].reviewComment = `Autograder: ${gradingErrorResponseData.error}`;
            existingChallenges[challenge.id].autograding = true;
          }

          autograderErrors += 1;
          console.error("❌❌❌ auto-grading failed:", gradingErrorResponseData?.error);
        })
        .then(async () => {
          await db.updateUser(challenge.userAddress, { challenges: existingChallenges }); // INFO: async, no await here.
        });
    }
  }

  console.log("\n\n#### Retroactive Autograding results\n");
  console.log("✔️  Accepted challenges:", acceptedChallenges, "\n");
  console.log("❌ Rejected challenges:", rejectedChallenges, " (not saved in the DB)\n");
  console.log("❗️ Autograder errors:", autograderErrors, "\n");
})();
