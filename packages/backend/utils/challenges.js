const challengeMapping = {
  "simple-nft-example": {
    id: 0,
    autograding: true,
  },
  "decentralized-staking": {
    id: 1,
    autograding: true,
  },
  "token-vendor": {
    id: 2,
    autograding: false,
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

function isAutogradingEnabledForChallenge(challengeId) {
  return challengeMapping[challengeId]?.autograding;
}

module.exports = {
  getChallengeIndexFromChallengeId,
  isAutogradingEnabledForChallenge,
};
