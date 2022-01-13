// TODO PR: how do we keep just one instance of this enum? Like a commons library
const EVENT_TYPES = {
  CHALLENGE_SUBMIT: "challenge.submit",
  CHALLENGE_REVIEW: "challenge.review",
  CHALLENGE_AUTOGRADE: "challenge.autograde",
  BUILD_SUBMIT: "build.submit",
  BUILD_REVIEW: "build.review",
  USER_CREATE: "user.create",
  USER_UPDATE: "user.update",
};

export const eventDisplay = ({ type, payload }) => {
  switch (type) {
    case EVENT_TYPES.CHALLENGE_SUBMIT: {
      return `submitted a solution for ${payload.challengeId}`;
    }

    case EVENT_TYPES.CHALLENGE_REVIEW: {
      return `The submitted ${payload.challengeId} challenge has been ${payload.reviewAction.toLowerCase()}`;
    }

    case EVENT_TYPES.CHALLENGE_AUTOGRADE: {
      return `The submitted "${
        payload.challengeId
      }" challenge has been ${payload.reviewAction.toLowerCase()} (autograded)`;
    }

    case EVENT_TYPES.BUILD_SUBMIT: {
      return `just submitted a new build!`;
    }

    case EVENT_TYPES.BUILD_REVIEW: {
      return `A submitted build has been ${payload.reviewAction.toLowerCase()}`;
    }

    case EVENT_TYPES.USER_CREATE: {
      return `just created a builder account. Welcome!`;
    }

    // ToDo. Build events. Wait until we tackled issue #134
    // https://github.com/moonshotcollective/scaffold-directory/issues/134

    default:
      // do nothing
      return "";
  }
};
