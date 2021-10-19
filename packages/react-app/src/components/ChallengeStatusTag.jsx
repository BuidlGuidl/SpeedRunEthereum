import React from "react";
import { Badge } from "@chakra-ui/react";
import { CHALLENGE_SUBMISSION_STATUS } from "../helpers/constants";

const ChallengeStatusTag = ({ status }) => {
  let colorScheme;
  let label;

  switch (status) {
    case CHALLENGE_SUBMISSION_STATUS.ACCEPTED: {
      colorScheme = "green";
      label = "Accepted";
      break;
    }
    case CHALLENGE_SUBMISSION_STATUS.REJECTED: {
      colorScheme = "red";
      label = "Rejected";
      break;
    }
    case CHALLENGE_SUBMISSION_STATUS.SUBMITTED: {
      label = "In progress";
      break;
    }
    default:
    // do nothing
  }

  return (
    <Badge borderRadius="xl" colorScheme={colorScheme} textTransform="none" py={0.5} px={2.5}>
      {label}
    </Badge>
  );
};

export default ChallengeStatusTag;
