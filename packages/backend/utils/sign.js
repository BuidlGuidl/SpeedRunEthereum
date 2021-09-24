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
        userAddress: options.userAddress,
        challengeId: options.challengeId,
        newStatus: options.newStatus,
      });
    case "login":
    default:
      return JSON.stringify({
        messageId,
        address: options.address,
      });
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
