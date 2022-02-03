const challengeMapping = {
  "simple-nft-example": {
    id: 0,
    autograding: true,
    successMessage: "You passed all tests on Challenge 0, keep it up!\n\n--\n\n",
  },
  "decentralized-staking": {
    id: 1,
    autograding: true,
    successMessage: "You passed all tests on Challenge 1, keep it up!\n\n--\n\n",
  },
  "token-vendor": {
    id: 2,
    autograding: true,
    successMessage: "You passed all tests on Challenge 2, keep it up!\n\n--\n\n",
  },
  "learn-multisig": {
    id: 3,
    autograding: false,
  },
  "minimum-viable-exchange": {
    id: 4,
    autograding: false,
  },
  "learn-oracles": {
    id: 5,
    autograding: false,
  },
};

function getChallengeIndexFromChallengeId(challengeId) {
  return challengeMapping[challengeId]?.id;
}

function getChallengeSuccessMessageFromChallengeId(challengeId) {
  return challengeMapping[challengeId]?.successMessage;
}

function isAutogradingEnabledForChallenge(challengeId) {
  return challengeMapping[challengeId]?.autograding;
}

module.exports = {
  getChallengeIndexFromChallengeId,
  getChallengeSuccessMessageFromChallengeId,
  isAutogradingEnabledForChallenge,
};
