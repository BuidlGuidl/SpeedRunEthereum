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
    autograding: true,
  },
  "dice-game": {
    id: 3,
    autograding: true,
  },
  "state-channels": {
    id: 9,
    autograding: true,
  },
  "minimum-viable-exchange": {
    id: 5,
    autograding: false,
  },
  "learn-multisig": {
    id: 6,
    autograding: false,
  },
  "nft-cohort": {
    id: 7,
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
