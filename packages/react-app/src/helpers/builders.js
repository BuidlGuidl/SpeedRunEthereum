import { CHALLENGE_SUBMISSION_STATUS } from "./constants";

export const getAcceptedChallenges = builderChallenges => {
  if (!builderChallenges) {
    return [];
  }

  return Object.keys(builderChallenges).filter(
    challengeId => builderChallenges[challengeId].status === CHALLENGE_SUBMISSION_STATUS.ACCEPTED,
  );
};
