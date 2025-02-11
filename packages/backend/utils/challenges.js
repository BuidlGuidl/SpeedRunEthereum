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
  "minimum-viable-exchange": {
    id: 4,
    autograding: true,
  },
  "state-channels": {
    id: 5,
    autograding: true,
  },
  "learn-multisig": {
    id: 6,
    autograding: false,
  },
  "nft-cohort": {
    id: 7,
    autograding: false,
  },
  stablecoins: {
    id: 8,
    autograding: false,
  },
  "prediction-markets": {
    id: 9,
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
