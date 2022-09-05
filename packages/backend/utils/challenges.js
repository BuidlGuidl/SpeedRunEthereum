const challengeMapping = {
  "simple-nft-example": {
    id: 0,
    autograding: true,
    successMessage: "You passed all tests on Challenge 0, keep it up!\n\n--\n\n",
    telegram: "https://t.me/+Y2vqXZZ_pEFhMGMx",
  },
  "decentralized-staking": {
    id: 1,
    autograding: true,
    successMessage: "You passed all tests on Challenge 1, keep it up!\n\n--\n\n",
    telegram: "https://t.me/joinchat/E6r91UFt4oMJlt01",
  },
  "token-vendor": {
    id: 2,
    autograding: true,
    successMessage: "You have successfully passed challenge 2!  Keep it ip with Challenge 3 - Dice Game!\n\n--\n\n",
    telegram: "https://t.me/joinchat/IfARhZFc5bfPwpjq",
  },
  "dice-game": {
    id: 3,
    autograding: true,
    successMessage:
      "This looks good! Demo site and contract code are solid and the dice only roll when it’s a winner!\n\nYou have passed the first four challenges on SpeedRunEthereum and can now join the BuildGuidl! Head to your profile on SpeedRunEthereum.com and use the link to join. This will also unlock the more challenging Decentralized Exchange, Multisig, and SVG NFT challenges. These are more open ended which, once complete, can be submitted as a build on your buidlguidl.com portfolio to show off your web3 knowledge!\n\nJoin the next challenge’s Telegram channel on SpeedRunEthereum to get started.  This channel includes other builders and BuidlGuild members to guide you along the way\n\n--\n\n",
    telegram: "https://t.me/+3StA0aBSArFjNjUx",
  },
  "learn-multisig": {
    id: 4,
    autograding: false,
  },
  "minimum-viable-exchange": {
    id: 5,
    autograding: false,
  },
  "learn-oracles": {
    id: 6,
    autograding: false,
  },
};

function getChallengeIndexFromChallengeId(challengeId) {
  return challengeMapping[challengeId]?.id;
}

function getChallengeTelegramChannel(challengeId) {
  return challengeMapping[challengeId]?.telegram;
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
  getChallengeTelegramChannel,
};
