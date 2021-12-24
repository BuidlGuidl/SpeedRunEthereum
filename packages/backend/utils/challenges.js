const challengeMapping = {
  "simple-nft-example": 0,
  "decentralized-staking": 1,
  "token-vendor": 2,
  "learn-multisig": 3,
  "minimum-viable-exchange": 4,
  "learn-oracles": 5,
};

function getChallengeIndexFromChallengeId(challengeId) {
  return challengeMapping[challengeId];
}

module.exports = {
  getChallengeIndexFromChallengeId,
};
