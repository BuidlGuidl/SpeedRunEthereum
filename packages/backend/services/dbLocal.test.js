const fs = require("fs");
fs.writeFileSync(
  "./local_database/__testing__local_db.json",
  JSON.stringify({
    users: {},
    events: [],
  }),
);
const { URLSearchParams } = require("url");

const db = require("./dbLocal");
const { EVENT_TYPES, createEvent, queryParamsToConditions } = require("../utils/events");
const { database } = require("firebase-admin");

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
    builderAddress: dummyAddressA,
    challengeId: dummyChallengeIdA,
    deployedUrl: "https://moonshotcollective.space/",
    branchUrl: "https://github.com/moonshotcollective/scaffold-directory",
  },
  [EVENT_TYPES.CHALLENGE_REVIEW]: {
    reviewAction: "ACCEPTED",
    builderAddress: dummyAddressA,
    reviewerAddress: dummyAddressB,
    challengeId: dummyChallengeIdA,
    reviewMessage: dummyMessage,
  },
  [EVENT_TYPES.USER_CREATE]: {
    userAddress: dummyAddressA,
  },
};

const clearDb = () => {
  db.__internal_database.events = [];
};

const createTestEvent = (type, partialPayload) => {
  const dummyPayload = dummyPayloadsByType[type];

  const payload = {
    ...dummyPayload,
    ...partialPayload,
  };

  return createEvent(type, payload, dummySignature);
};

const queryStringToQueryObject = queryString => {
  const queryObject = {};
  const urlSearchParams = new URLSearchParams(queryString);
  urlSearchParams.forEach((value, name) => {
    queryObject[name] = value;
  });
  return queryObject;
};

const queryStringToConditions = queryString => {
  const queryObject = queryStringToQueryObject(queryString);
  return queryParamsToConditions(queryObject);
};

const userCreateEventA = createTestEvent(EVENT_TYPES.USER_CREATE, { userAddress: dummyAddressA });
const userCreateEventB = createTestEvent(EVENT_TYPES.USER_CREATE, { userAddress: dummyAddressB });
const challengeSubmitEventA = createTestEvent(EVENT_TYPES.CHALLENGE_SUBMIT, { builderAddress: dummyAddressA });
const challengeSubmitEventB = createTestEvent(EVENT_TYPES.CHALLENGE_SUBMIT, { builderAddress: dummyAddressB });
const challengeReviewApproveEventA = createTestEvent(EVENT_TYPES.CHALLENGE_REVIEW, {
  builderAddress: dummyAddressA,
  reviewerAddress: dummyAddressC,
  reviewAction: "ACCEPTED",
});
const challengeReviewApproveEventB = createTestEvent(EVENT_TYPES.CHALLENGE_REVIEW, {
  builderAddress: dummyAddressB,
  reviewerAddress: dummyAddressC,
  reviewAction: "ACCEPTED",
});
const challengeReviewRejectEventA = createTestEvent(EVENT_TYPES.CHALLENGE_REVIEW, {
  builderAddress: dummyAddressA,
  reviewerAddress: dummyAddressC,
  reviewAction: "REJECTED",
});
const challengeReviewRejectEventB = createTestEvent(EVENT_TYPES.CHALLENGE_REVIEW, {
  builderAddress: dummyAddressB,
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

beforeEach(() => {
  clearDb();
});

afterAll(() => {
  fs.rmSync("./local_database/__testing__local_db.json");
});

describe("The local database", () => {
  describe("The events method", () => {
    it("can create any type of event", () => {
      const userCreateEvent = createTestEvent(EVENT_TYPES.USER_CREATE);
      db.createEvent(userCreateEvent);

      const challengeSubmitEvent = createTestEvent(EVENT_TYPES.CHALLENGE_SUBMIT);
      db.createEvent(challengeSubmitEvent);

      const challengeReviewApproveEvent = createTestEvent(EVENT_TYPES.CHALLENGE_REVIEW, { reviewAction: "ACCEPTED" });
      db.createEvent(challengeReviewApproveEvent);

      const challengeReviewRejectEvent = createTestEvent(EVENT_TYPES.CHALLENGE_REVIEW, { reviewAction: "REJECTED" });
      db.createEvent(challengeReviewRejectEvent);

      const allEventsRecorded = db.findAllEvents();

      expect(allEventsRecorded).toHaveLength(4);
      expect(allEventsRecorded).toEqual([
        userCreateEvent,
        challengeSubmitEvent,
        challengeReviewApproveEvent,
        challengeReviewRejectEvent,
      ]);
    });

    describe("querying events", () => {
      it("by type", () => {
        seedDb();
        const queryStringUserCreate = `type=${EVENT_TYPES.USER_CREATE}`;
        const conditionsUserCreate = queryStringToConditions(queryStringUserCreate);
        const resultingEventsUserCreate = db.findEventsWhere({ conditions: conditionsUserCreate });
        expect(resultingEventsUserCreate).toHaveLength(2);
        expect(resultingEventsUserCreate).toEqual([userCreateEventA, userCreateEventB]);

        const queryStringChallengeSubmit = `type=${EVENT_TYPES.CHALLENGE_SUBMIT}`;
        const conditionsChallengeSubmit = queryStringToConditions(queryStringChallengeSubmit);
        const resultingEventsChallengeSubmit = db.findEventsWhere({ conditions: conditionsChallengeSubmit });
        expect(resultingEventsChallengeSubmit).toHaveLength(2);
        expect(resultingEventsChallengeSubmit).toEqual([challengeSubmitEventA, challengeSubmitEventB]);

        const queryStringChallengeReview = `type=${EVENT_TYPES.CHALLENGE_REVIEW}`;
        const conditionsChallengeReview = queryStringToConditions(queryStringChallengeReview);
        const resultingEventsChallengeReview = db.findEventsWhere({ conditions: conditionsChallengeReview });
        expect(resultingEventsChallengeReview).toHaveLength(4);
        expect(resultingEventsChallengeReview).toEqual([
          challengeReviewApproveEventA,
          challengeReviewApproveEventB,
          challengeReviewRejectEventA,
          challengeReviewRejectEventB,
        ]);
      });

      it("by builder", () => {
        seedDb();
        const queryStringA = `builder=${dummyAddressA}`;
        const conditionsA = queryStringToConditions(queryStringA);
        const resultingEventsA = db.findEventsWhere({ conditions: conditionsA });
        expect(resultingEventsA).toHaveLength(4);
        expect(resultingEventsA).toEqual([
          userCreateEventA,
          challengeSubmitEventA,
          challengeReviewApproveEventA,
          challengeReviewRejectEventA,
        ]);

        const queryStringB = `builder=${dummyAddressB}`;
        const conditionsB = queryStringToConditions(queryStringB);
        const resultingEventsB = db.findEventsWhere({ conditions: conditionsB });
        expect(resultingEventsB).toHaveLength(4);
        expect(resultingEventsB).toEqual([
          userCreateEventB,
          challengeSubmitEventB,
          challengeReviewApproveEventB,
          challengeReviewRejectEventB,
        ]);

        const queryStringC = `builder=${dummyAddressC}`;
        const conditionsC = queryStringToConditions(queryStringC);
        const resultingEventsC = db.findEventsWhere({ conditions: conditionsC });
        expect(resultingEventsC).toHaveLength(0);
      });

      it("by challengeId", () => {
        seedDb();
        const queryStringChallengeIdA = `challengeId=${dummyChallengeIdA}`;
        const conditionsChallengeIdA = queryStringToConditions(queryStringChallengeIdA);
        const resultingEventsChallengeIdA = db.findEventsWhere({ conditions: conditionsChallengeIdA });
        expect(resultingEventsChallengeIdA).toHaveLength(6);
        expect(resultingEventsChallengeIdA).toEqual([
          challengeSubmitEventA,
          challengeSubmitEventB,
          challengeReviewApproveEventA,
          challengeReviewApproveEventB,
          challengeReviewRejectEventA,
          challengeReviewRejectEventB,
        ]);

        const queryStringChallengeIdB = `challengeId=${dummyChallengeIdB}`;
        const conditionsChallengeIdB = queryStringToConditions(queryStringChallengeIdB);
        const resultingEventsChallengeIdB = db.findEventsWhere({ conditions: conditionsChallengeIdB });
        expect(resultingEventsChallengeIdB).toHaveLength(0);
      });

      it("by reviewAction", () => {
        seedDb();
        const queryStringChallengeReviewApproved = `reviewAction=ACCEPTED`;
        const conditionsChallengeReviewApproved = queryStringToConditions(queryStringChallengeReviewApproved);
        const resultingEventsChallengeReviewApproved = db.findEventsWhere({
          conditions: conditionsChallengeReviewApproved,
        });
        expect(resultingEventsChallengeReviewApproved).toHaveLength(2);
        expect(resultingEventsChallengeReviewApproved).toEqual([
          challengeReviewApproveEventA,
          challengeReviewApproveEventB,
        ]);

        const queryStringChallengeReviewRejected = `reviewAction=REJECTED`;
        const conditionsChallengeReviewRejected = queryStringToConditions(queryStringChallengeReviewRejected);
        const resultingEventsChallengeReviewRejected = db.findEventsWhere({
          conditions: conditionsChallengeReviewRejected,
        });
        expect(resultingEventsChallengeReviewRejected).toHaveLength(2);
        expect(resultingEventsChallengeReviewRejected).toEqual([
          challengeReviewRejectEventA,
          challengeReviewRejectEventB,
        ]);
      });

      it("by reviewer", () => {
        seedDb();
        const anotherReviewEvent = createTestEvent(EVENT_TYPES.CHALLENGE_REVIEW, {
          reviewAction: "ACCEPTED",
          reviewerAddress: "notDummyAddressC",
        });
        db.createEvent(anotherReviewEvent);

        const queryStringChallengeReviewer = `reviewer=${dummyAddressC}`;
        const conditionsChallengeReviewer = queryStringToConditions(queryStringChallengeReviewer);
        const resultingEventsChallengeReviewer = db.findEventsWhere({
          conditions: conditionsChallengeReviewer,
        });
        expect(resultingEventsChallengeReviewer).toHaveLength(4);
        expect(resultingEventsChallengeReviewer).toEqual([
          challengeReviewApproveEventA,
          challengeReviewApproveEventB,
          challengeReviewRejectEventA,
          challengeReviewRejectEventB,
        ]);

        const queryStringChallengeDifferentReviewer = `reviewer=notDummyAddressC`;
        const conditionsChallengeDifferentReviewer = queryStringToConditions(queryStringChallengeDifferentReviewer);
        const resultingEventsChallengeDifferentReviewer = db.findEventsWhere({
          conditions: conditionsChallengeDifferentReviewer,
        });
        expect(resultingEventsChallengeDifferentReviewer).toHaveLength(1);
        expect(resultingEventsChallengeDifferentReviewer).toEqual([anotherReviewEvent]);
      });

      it("by combining filters", () => {
        seedDb();
        const queryExpectedNoResults = `type=${EVENT_TYPES.USER_CREATE}&reviewer=${dummyAddressC}`;
        const conditionsExpectedNoResults = queryStringToConditions(queryExpectedNoResults);
        const resultingExpectedNoResults = db.findEventsWhere({
          conditions: conditionsExpectedNoResults,
        });
        expect(resultingExpectedNoResults).toHaveLength(0);

        const query2 = `type=${EVENT_TYPES.USER_CREATE},${EVENT_TYPES.CHALLENGE_SUBMIT}&builder=${dummyAddressA}`;
        const conditions2 = queryStringToConditions(query2);
        const results2 = db.findEventsWhere({
          conditions: conditions2,
        });
        expect(results2).toHaveLength(2);
        expect(results2).toEqual([userCreateEventA, challengeSubmitEventA]);

        const anotherUserEvent = createTestEvent(EVENT_TYPES.USER_CREATE, {
          userAddress: "anotherUser",
        });
        db.createEvent(anotherUserEvent);
        const query3 = `type=${EVENT_TYPES.USER_CREATE}&builder=${dummyAddressA},${dummyAddressB}`;
        const conditions3 = queryStringToConditions(query3);
        const results3 = db.findEventsWhere({
          conditions: conditions3,
        });
        const queryStringUserCreate = `type=${EVENT_TYPES.USER_CREATE}`;
        const conditionsUserCreate = queryStringToConditions(queryStringUserCreate);
        const resultingEventsUserCreate = db.findEventsWhere({ conditions: conditionsUserCreate });
        expect(results3).toHaveLength(2);
        expect(resultingEventsUserCreate).toHaveLength(3);
        expect(results3).toEqual([userCreateEventA, userCreateEventB]);
        expect(resultingEventsUserCreate).toEqual([userCreateEventA, userCreateEventB, anotherUserEvent]);
      });
    });
  });
});
