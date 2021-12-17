// TODO PR: how do we keep just one instance of this enum? Like a commons library
const EVENT_TYPES = {
  CHALLENGE_SUBMIT: "challenge.submit",
  CHALLENGE_REVIEW: "challenge.review",
  CHALLENGE_CREATE: "challenge.create",
  // ToDo. Review this when #134 is done.
  // https://github.com/moonshotcollective/scaffold-directory/issues/134
  BUILD_SUBMIT: "build.create",
  USER_CREATE: "user.create",
  USER_UPDATE: "user.update",
};

export const eventDisplay = ({ type, payload }) => {
  switch (type) {
    case EVENT_TYPES.CHALLENGE_SUBMIT: {
      return `submitted a solution for ${payload.challengeId}`;
    }

    case EVENT_TYPES.CHALLENGE_REVIEW: {
      return `A challenge submitted has been ${payload.reviewAction.toLowerCase()}`;
    }

    case EVENT_TYPES.BUILD_SUBMIT: {
      return `just submitted a build!`;
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
