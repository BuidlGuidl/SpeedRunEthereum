const EVENT_TYPES = {
  CHALLENGE_SUBMIT: "challenge.submit",
  CHALLENGE_REVIEW: "challenge.review",
  CHALLENGE_AUTOGRADE: "challenge.autograde",
  BUILD_SUBMIT: "build.submit",
  BUILD_REVIEW: "build.review",
  USER_CREATE: "user.create",
  USER_UPDATE: "user.update",
};

// TODO we could check here if the payload is correct for the type
const createEvent = (type, payload, signature) => ({
  type,
  timestamp: new Date().getTime(),
  signature,
  payload,
});

const validParams = ["limit", "type", "user", "challengeId", "buildId", "reviewAction", "reviewer"];
const validReviewActions = ["ACCEPTED", "REJECTED"]; // TODO this should be a shared constant
const validTypes = Object.values(EVENT_TYPES);
const validateEventsQueryParams = query => {
  const failingQueries = [];
  Object.entries(query).forEach(([name, values]) => {
    if (!validParams.includes(name)) {
      failingQueries.push([name]);
      return;
    }

    const valuesArray = values.split(",");
    if (name === "type") {
      valuesArray.forEach(value => {
        if (!validTypes.includes(value)) {
          failingQueries.push([name, value]);
        }
      });
    }
    if (name === "reviewAction") {
      valuesArray.forEach(value => {
        if (!validReviewActions.includes(value)) {
          failingQueries.push([name, value]);
        }
      });
    }
  });
  return failingQueries;
};

const queryParamsToConditions = query => {
  const conditions = {};
  Object.entries(query).forEach(([name, values]) => {
    switch (name) {
      case "type": {
        conditions.type = values;
        break;
      }
      case "user": {
        conditions["payload/userAddress"] = values;
        break;
      }
      case "challengeId": {
        conditions["payload/challengeId"] = values;
        break;
      }
      case "buildId": {
        conditions["payload/buildId"] = values;
        break;
      }
      case "reviewAction": {
        conditions["payload/reviewAction"] = values;
        break;
      }
      case "reviewer": {
        conditions["payload/reviewerAddress"] = values;
        break;
      }
      default:
      // do nothing
    }
  });
  return conditions;
};

module.exports = {
  EVENT_TYPES,
  createEvent,
  validateEventsQueryParams,
  queryParamsToConditions,
};
