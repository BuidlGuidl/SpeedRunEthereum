require("dotenv").config();
const axios = require("axios");
const { getChallengeIndexFromChallengeId } = require("../utils/challenges");

const AUTOGRADING_SERVER = process.env.AUTOGRADING_SERVER;

// Calls the autograder service to run the tests for a given challenge / contract
const runTestsForChallenge = async (challengeId, contractUrl) => {
  if (!AUTOGRADING_SERVER) {
    throw new Error("Autograding server not defined");
  }

  // Auto-grading
  const challengeIndex = getChallengeIndexFromChallengeId(challengeId);
  const contractUrlObject = new URL(contractUrl);
  // ToDo. Validation (also in the front-end, make sure they enter the correct URL)
  const network = contractUrlObject.host.split(".")[0];
  const contractAddress = contractUrlObject.pathname.replace("/address/", "");
  console.log("Calling the auto-grader to run tests for", challengeId, network);

  return axios
    .post(AUTOGRADING_SERVER, {
      challenge: challengeIndex,
      network,
      address: contractAddress,
    })
    .then(async gradingResponse => {
      // We don't wait for the auto grading to finish to return a response.
      const gradingResponseData = gradingResponse.data;
      console.log("auto-grading response data", gradingResponseData);

      return gradingResponseData;
    })
    .catch(gradingErrorResponse => {
      const gradingErrorResponseData = gradingErrorResponse?.response?.data;
      const error = gradingErrorResponseData?.error ?? "Unknown error";

      console.error("auto-grader failed:", error);
      throw new Error(`auto-grader failed: ${error}`);
    });
};

module.exports = {
  runTestsForChallenge,
};
