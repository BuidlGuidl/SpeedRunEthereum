const log = console.log.bind({}); // get the original console.log to use here for debugging with `log()`
global.log = log;
global.console.log = jest.fn(); // skip server logs

const { URLSearchParams } = require("url");

const db = require("./dbLocal");
const { EVENT_TYPES, queryParamsToConditions } = require("../utils/events");
const {
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
} = require("../utils/testingUtils");

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

beforeEach(() => {
  clearDb(db);
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
      expect(allEventsRecorded).toEqual(
        [userCreateEvent, challengeSubmitEvent, challengeReviewApproveEvent, challengeReviewRejectEvent].reverse(),
      );
    });

    describe("querying events", () => {
      it("by type", () => {
        seedDb(db);
        const queryStringUserCreate = `type=${EVENT_TYPES.USER_CREATE}`;
        const conditionsUserCreate = queryStringToConditions(queryStringUserCreate);
        const resultingEventsUserCreate = db.findEventsWhere({ conditions: conditionsUserCreate });
        expect(resultingEventsUserCreate).toHaveLength(2);
        expect(resultingEventsUserCreate).toEqual([userCreateEventA, userCreateEventB].reverse());

        const queryStringChallengeSubmit = `type=${EVENT_TYPES.CHALLENGE_SUBMIT}`;
        const conditionsChallengeSubmit = queryStringToConditions(queryStringChallengeSubmit);
        const resultingEventsChallengeSubmit = db.findEventsWhere({ conditions: conditionsChallengeSubmit });
        expect(resultingEventsChallengeSubmit).toHaveLength(2);
        expect(resultingEventsChallengeSubmit).toEqual([challengeSubmitEventA, challengeSubmitEventB].reverse());

        const queryStringChallengeReview = `type=${EVENT_TYPES.CHALLENGE_REVIEW}`;
        const conditionsChallengeReview = queryStringToConditions(queryStringChallengeReview);
        const resultingEventsChallengeReview = db.findEventsWhere({ conditions: conditionsChallengeReview });
        expect(resultingEventsChallengeReview).toHaveLength(4);
        expect(resultingEventsChallengeReview).toEqual(
          [
            challengeReviewApproveEventA,
            challengeReviewApproveEventB,
            challengeReviewRejectEventA,
            challengeReviewRejectEventB,
          ].reverse(),
        );
      });

      it("by user", () => {
        seedDb(db);
        const queryStringA = `user=${dummyAddressA}`;
        const conditionsA = queryStringToConditions(queryStringA);
        const resultingEventsA = db.findEventsWhere({ conditions: conditionsA });
        expect(resultingEventsA).toHaveLength(4);
        expect(resultingEventsA).toEqual(
          [
            userCreateEventA,
            challengeSubmitEventA,
            challengeReviewApproveEventA,
            challengeReviewRejectEventA,
          ].reverse(),
        );

        const queryStringB = `user=${dummyAddressB}`;
        const conditionsB = queryStringToConditions(queryStringB);
        const resultingEventsB = db.findEventsWhere({ conditions: conditionsB });
        expect(resultingEventsB).toHaveLength(4);
        expect(resultingEventsB).toEqual(
          [
            userCreateEventB,
            challengeSubmitEventB,
            challengeReviewApproveEventB,
            challengeReviewRejectEventB,
          ].reverse(),
        );

        const queryStringC = `user=${dummyAddressC}`;
        const conditionsC = queryStringToConditions(queryStringC);
        const resultingEventsC = db.findEventsWhere({ conditions: conditionsC });
        expect(resultingEventsC).toHaveLength(0);
      });

      it("by challengeId", () => {
        seedDb(db);
        const queryStringChallengeIdA = `challengeId=${dummyChallengeIdA}`;
        const conditionsChallengeIdA = queryStringToConditions(queryStringChallengeIdA);
        const resultingEventsChallengeIdA = db.findEventsWhere({ conditions: conditionsChallengeIdA });
        expect(resultingEventsChallengeIdA).toHaveLength(6);
        expect(resultingEventsChallengeIdA).toEqual(
          [
            challengeSubmitEventA,
            challengeSubmitEventB,
            challengeReviewApproveEventA,
            challengeReviewApproveEventB,
            challengeReviewRejectEventA,
            challengeReviewRejectEventB,
          ].reverse(),
        );

        const queryStringChallengeIdB = `challengeId=${dummyChallengeIdB}`;
        const conditionsChallengeIdB = queryStringToConditions(queryStringChallengeIdB);
        const resultingEventsChallengeIdB = db.findEventsWhere({ conditions: conditionsChallengeIdB });
        expect(resultingEventsChallengeIdB).toHaveLength(0);
      });

      it("by reviewAction", () => {
        seedDb(db);
        const queryStringChallengeReviewApproved = `reviewAction=ACCEPTED`;
        const conditionsChallengeReviewApproved = queryStringToConditions(queryStringChallengeReviewApproved);
        const resultingEventsChallengeReviewApproved = db.findEventsWhere({
          conditions: conditionsChallengeReviewApproved,
        });
        expect(resultingEventsChallengeReviewApproved).toHaveLength(2);
        expect(resultingEventsChallengeReviewApproved).toEqual(
          [challengeReviewApproveEventA, challengeReviewApproveEventB].reverse(),
        );

        const queryStringChallengeReviewRejected = `reviewAction=REJECTED`;
        const conditionsChallengeReviewRejected = queryStringToConditions(queryStringChallengeReviewRejected);
        const resultingEventsChallengeReviewRejected = db.findEventsWhere({
          conditions: conditionsChallengeReviewRejected,
        });
        expect(resultingEventsChallengeReviewRejected).toHaveLength(2);
        expect(resultingEventsChallengeReviewRejected).toEqual(
          [challengeReviewRejectEventA, challengeReviewRejectEventB].reverse(),
        );
      });

      it("by reviewer", () => {
        seedDb(db);
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
        expect(resultingEventsChallengeReviewer).toEqual(
          [
            challengeReviewApproveEventA,
            challengeReviewApproveEventB,
            challengeReviewRejectEventA,
            challengeReviewRejectEventB,
          ].reverse(),
        );

        const queryStringChallengeDifferentReviewer = `reviewer=notDummyAddressC`;
        const conditionsChallengeDifferentReviewer = queryStringToConditions(queryStringChallengeDifferentReviewer);
        const resultingEventsChallengeDifferentReviewer = db.findEventsWhere({
          conditions: conditionsChallengeDifferentReviewer,
        });
        expect(resultingEventsChallengeDifferentReviewer).toHaveLength(1);
        expect(resultingEventsChallengeDifferentReviewer).toEqual([anotherReviewEvent]);
      });

      it("by combining filters", () => {
        seedDb(db);
        const queryExpectedNoResults = `type=${EVENT_TYPES.USER_CREATE}&reviewer=${dummyAddressC}`;
        const conditionsExpectedNoResults = queryStringToConditions(queryExpectedNoResults);
        const resultingExpectedNoResults = db.findEventsWhere({
          conditions: conditionsExpectedNoResults,
        });
        expect(resultingExpectedNoResults).toHaveLength(0);

        const query2 = `type=${EVENT_TYPES.USER_CREATE},${EVENT_TYPES.CHALLENGE_SUBMIT}&user=${dummyAddressA}`;
        const conditions2 = queryStringToConditions(query2);
        const results2 = db.findEventsWhere({
          conditions: conditions2,
        });
        expect(results2).toHaveLength(2);
        expect(results2).toEqual([userCreateEventA, challengeSubmitEventA].reverse());

        const anotherUserEvent = createTestEvent(EVENT_TYPES.USER_CREATE, {
          userAddress: "anotherUser",
        });
        db.createEvent(anotherUserEvent);
        const query3 = `type=${EVENT_TYPES.USER_CREATE}&user=${dummyAddressA},${dummyAddressB}`;
        const conditions3 = queryStringToConditions(query3);
        const results3 = db.findEventsWhere({
          conditions: conditions3,
        });
        const queryStringUserCreate = `type=${EVENT_TYPES.USER_CREATE}`;
        const conditionsUserCreate = queryStringToConditions(queryStringUserCreate);
        const resultingEventsUserCreate = db.findEventsWhere({ conditions: conditionsUserCreate });
        expect(results3).toHaveLength(2);
        expect(resultingEventsUserCreate).toHaveLength(3);
        expect(results3).toEqual([userCreateEventA, userCreateEventB].reverse());
        expect(resultingEventsUserCreate).toEqual([userCreateEventA, userCreateEventB, anotherUserEvent].reverse());
      });
    });
  });
});
