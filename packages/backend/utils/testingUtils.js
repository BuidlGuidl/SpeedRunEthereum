const fs = require("fs");
const { EVENT_TYPES, createEvent } = require("./events");

const createLocalTestingDbFile = () => {
  fs.writeFileSync(
    "./local_database/__testing__local_db.json",
    JSON.stringify({
      users: {},
      events: [],
    }),
  );
};
const removeLocalTestingDbFile = () => {
  fs.rmSync("./local_database/__testing__local_db.json");
};

const dummyAddressA = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const dummyAddressB = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const dummyAddressC = "0xcccccccccccccccccccccccccccccccccccccccc";
const dummyChallengeIdA = "dummy-challenge-a";
const dummyChallengeIdB = "dummy-challenge-b";
const dummyMessage = "foo bar baz";
const dummySignature =
  "0xcdfefbe69ddd8ab12e1977204e8386e2a269569cc3a0239d47a7a49d08b68c7725c88bd58910349ffc12710868ae7f06b94bb27aca10e2db8e3eb102f34755b41b";

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

const seedDb = db => {
  db.createEvent(userCreateEventA);
  db.createEvent(userCreateEventB);
  db.createEvent(challengeSubmitEventA);
  db.createEvent(challengeSubmitEventB);
  db.createEvent(challengeReviewApproveEventA);
  db.createEvent(challengeReviewApproveEventB);
  db.createEvent(challengeReviewRejectEventA);
  db.createEvent(challengeReviewRejectEventB);
};

const clearDb = db => {
  // eslint-disable-next-line
  db.__internal_database.events = [];
};

module.exports = {
  createLocalTestingDbFile,
  removeLocalTestingDbFile,
  createTestEvent,
  clearDb,
  seedDb,
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
