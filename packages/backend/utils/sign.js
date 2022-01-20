const ethers = require("ethers");

const getSignMessageForId = (messageId, options) => {
  switch (messageId) {
    case "challengeSubmit":
      // ToDo. Submission nonce.
      return JSON.stringify({
        messageId,
        address: options.address,
        challengeId: options.challengeId,
      });
    case "challengeReview":
      // ToDo. Submission nonce.
      return JSON.stringify({
        messageId,
        address: options.address,
        userAddress: options.userAddress,
        challengeId: options.challengeId,
        newStatus: options.newStatus,
      });
    case "buildSubmit":
      return JSON.stringify({
        messageId,
        address: options.address,
        buildUrl: options.buildUrl,
      });
    case "buildReview":
      return JSON.stringify({
        messageId,
        address: options.address,
        buildId: options.buildId,
        newStatus: options.newStatus,
      });
    case "builderUpdateSocials":
      return `I want to update my social links as ${options.address}`;
    case "builderUpdateReachedOut":
      return `I want to mark builder ${options.builderAddress} as ${
        options.reachedOut ? "reached out" : "not reached out"
      }`;
    case "login":
    default:
      return `I would like to register as a builder in speedrunethereum.com as ${options.address}`;
  }
};

const verifySignature = (signature, verifyOptions) => {
  const trustedMessage = getSignMessageForId(verifyOptions.messageId, verifyOptions);
  const signingAddress = ethers.utils.verifyMessage(trustedMessage, signature);

  console.log("trustedMessage", trustedMessage);
  console.log("signingAddress       ", signingAddress);
  console.log("verifyOptions.address", verifyOptions.address);

  return signingAddress === verifyOptions.address;
};

module.exports = {
  getSignMessageForId,
  verifySignature,
};
