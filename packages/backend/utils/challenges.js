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
    successMessage:
      "Since you've passed the first three challenges the Decentralized Exchange(DEX) challenge should unlock for you at [SpeedRunEthereum.com](https://speedrunethereum.com).  This leads to a Telegram channel with some helpful information in the pinned message.\n\n Once you finish that challenge, post it to the [bazaar.buidlguidl.com](https://bazaar.buidlguidl.com) to add to your web3 portfolio! You can also update your status in the Bazaar with what you’re working on. \n\nKeep on building!\n\n--\n\n",
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
