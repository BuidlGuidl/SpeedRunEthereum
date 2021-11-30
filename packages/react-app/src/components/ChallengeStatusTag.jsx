import React from "react";
import { Badge, HStack, Tooltip } from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { CHALLENGE_SUBMISSION_STATUS } from "../helpers/constants";

const ChallengeStatusTag = ({ status, comment }) => {
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
      label = "Submitted";
      break;
    }
    default:
    // do nothing
  }

  return (
    <HStack>
      <Badge borderRadius="xl" colorScheme={colorScheme} textTransform="none" py={0.5} px={2.5}>
        {label}
      </Badge>
      {status === CHALLENGE_SUBMISSION_STATUS.REJECTED && (
        <Tooltip label={comment}>
          <QuestionOutlineIcon ml="2px" />
        </Tooltip>
      )}
    </HStack>
  );
};

export default ChallengeStatusTag;
