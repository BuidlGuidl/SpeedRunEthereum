const db = require("../services/db");
const { EVENT_TYPES, createEvent } = require("./events");

const hardhatAddress1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const dummyAddressA = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const dummyAddressB = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const dummyAddressC = "0xcccccccccccccccccccccccccccccccccccccccc";
const dummyChallengeIdA = "dummy-challenge-a";
const dummyChallengeIdB = "dummy-challenge-b";
const dummyMessage = "foo bar baz";
const dummySignature =
  "0xcdfefbe69ddd8ab12e1977204e8386e2a269569cc3a0239d47a7a49d08b68c7725c88bd58910349ffc12710868ae7f06b94bb27aca10e2db8e3eb102f34755b41b";
const hardhatSignatures = {
  login:
    "0x1db83f046ed2ab9a812f6d78e5c196492cbc18800da41bdbb42cece8bead47d77ed795cf6eb3fc81ac05883ec4731b6304791fc7ace949d5850b28113041fafd1c",
  // challengeSubmit signature for challengeId: simple-nft-example
  challengeSubmit:
    "0xd4e2e7c23450e2d53e6708265dec6bb61a2bd94ea1595bc99a3b5a81fd111c6b3dcd3a459bb8a580ac6057caceb61c1c7b1b4d23fadc863f3e066876287691351c",
  challengeReviewAccept:
    "0x69b40c155f7a1046467f2e84ac1b40ac03f6d1ea304be5d35458fe60a8798f3c79903ab1523b294a2983434b0962e373c78f8aac33b5c9eca94aeb76143883a41c",
  challengeReviewReject:
    "0xd991f53e387ae22b62587ad6a44a81d7fbfb3e339552ee0789af0fabbbc6b433682d78e7e70b9cb8382a1c9f6efc4fafee89999599c7b5ab5614e071dd9bd4911c",
};

const upgradeUserToAdmin = userAddress => {
  db.__internal_database.users[userAddress].role = "admin";
};

const dummyPayloadsByType = {
  [EVENT_TYPES.CHALLENGE_SUBMIT]: {
    userAddress: dummyAddressA,
    challengeId: dummyChallengeIdA,
    deployedUrl: "https://moonshotcollective.space/",
    contractUrl: "https://etherscan.io/token/0xde30da39c46104798bb5aa3fe8b9e0e1f348163f",
  },
  [EVENT_TYPES.CHALLENGE_REVIEW]: {
    reviewAction: "ACCEPTED",
    userAddress: dummyAddressA,
    reviewerAddress: dummyAddressB,
    challengeId: dummyChallengeIdA,
    reviewMessage: dummyMessage,
  },
  [EVENT_TYPES.USER_CREATE]: {
    userAddress: dummyAddressA,
  },
};

const createTestEvent = (type, partialPayload) => {
  const dummyPayload = dummyPayloadsByType[type];

  const payload = {
    ...dummyPayload,
    ...partialPayload,
  };

  return createEvent(type, payload, dummySignature);
};

const userCreateEventA = createTestEvent(EVENT_TYPES.USER_CREATE, { userAddress: dummyAddressA });
const userCreateEventB = createTestEvent(EVENT_TYPES.USER_CREATE, { userAddress: dummyAddressB });
const challengeSubmitEventA = createTestEvent(EVENT_TYPES.CHALLENGE_SUBMIT, { userAddress: dummyAddressA });
const challengeSubmitEventB = createTestEvent(EVENT_TYPES.CHALLENGE_SUBMIT, { userAddress: dummyAddressB });
const challengeReviewApproveEventA = createTestEvent(EVENT_TYPES.CHALLENGE_REVIEW, {
  userAddress: dummyAddressA,
  reviewerAddress: dummyAddressC,
  reviewAction: "ACCEPTED",
});
const challengeReviewApproveEventB = createTestEvent(EVENT_TYPES.CHALLENGE_REVIEW, {
  userAddress: dummyAddressB,
  reviewerAddress: dummyAddressC,
  reviewAction: "ACCEPTED",
});
const challengeReviewRejectEventA = createTestEvent(EVENT_TYPES.CHALLENGE_REVIEW, {
  userAddress: dummyAddressA,
  reviewerAddress: dummyAddressC,
  reviewAction: "REJECTED",
});
const challengeReviewRejectEventB = createTestEvent(EVENT_TYPES.CHALLENGE_REVIEW, {
  userAddress: dummyAddressB,
  reviewerAddress: dummyAddressC,
  reviewAction: "REJECTED",
});

const seedDb = () => {
  db.createEvent(userCreateEventA);
  db.createEvent(userCreateEventB);
  db.createEvent(challengeSubmitEventA);
  db.createEvent(challengeSubmitEventB);
  db.createEvent(challengeReviewApproveEventA);
  db.createEvent(challengeReviewApproveEventB);
  db.createEvent(challengeReviewRejectEventA);
  db.createEvent(challengeReviewRejectEventB);
};

const clearDb = () => {
  // IMPORTANT: clear each prop here, or we'll lose the reference to the
  // database (the actual in-memory db, not the interface) that the app
  // object has and updates

  // eslint-disable-next-line
  db.__internal_database.version = 0;
  db.__internal_database.builds = {};
  db.__internal_database.users = {};
  db.__internal_database.events = [];
};

module.exports = {
  createTestEvent,
  clearDb,
  seedDb,
  upgradeUserToAdmin,
  hardhatAddress1,
  hardhatSignatures,
  dummyAddressA,
  dummyAddressB,
  dummyAddressC,
  dummyChallengeIdA,
  dummyChallengeIdB,
  userCreateEventA,
  userCreateEventB,
  challengeSubmitEventA,
  challengeSubmitEventB,
  challengeReviewApproveEventA,
  challengeReviewApproveEventB,
  challengeReviewRejectEventA,
  challengeReviewRejectEventB,
};
