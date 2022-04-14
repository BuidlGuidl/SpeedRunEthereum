import React from "react";
import { Link as RouteLink } from "react-router-dom";
import {
  chakra,
  ButtonGroup,
  Button,
  IconButton,
  Tooltip,
  Center,
  Image,
  Flex,
  Spacer,
  Text,
  Link,
  Badge,
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";

import useCustomColorModes from "../hooks/useCustomColorModes";
import { CHALLENGE_SUBMISSION_STATUS } from "../helpers/constants";

const ChallengeExpandedCard = ({ challengeId, challenge, builderAttemptedChallenges }) => {
  const { borderColor, secondaryFontColor } = useCustomColorModes();

  const builderHasCompletedDependenciesChallenges = challenge.dependencies?.every(id => {
    if (!builderAttemptedChallenges[id]) {
      return false;
    }
    if (!(builderAttemptedChallenges[id].status === CHALLENGE_SUBMISSION_STATUS.ACCEPTED)) {
      return false;
    }
    if (challenge.lockedTimestamp) {
      return (
        new Date().getTime() - builderAttemptedChallenges[id].submittedTimestamp > challenge.lockedTimestamp * 60 * 1000
      );
    }

    return true;
  });

  const pendingDependenciesChallenges = challenge.dependencies?.filter(dependency => {
    return (
      !builderAttemptedChallenges[dependency] ||
      builderAttemptedChallenges[dependency].status !== CHALLENGE_SUBMISSION_STATUS.ACCEPTED
    );
  });

  const lockReasonToolTip = "The following challenges are not completed: " + pendingDependenciesChallenges.join(", ");

  const isRampUpChallenge = challenge.dependencies?.length === 0;
  const challengeStatus = builderAttemptedChallenges[challengeId]?.status;

  let colorScheme;
  let label;
  switch (challengeStatus) {
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

  const isChallengeLocked = challenge.disabled || !builderHasCompletedDependenciesChallenges;

  return (
    <Flex maxW={880} borderWidth="1px" borderRadius="lg" borderColor={borderColor} overflow="hidden" mb={6}>
      <Center borderBottom="1px" borderColor={borderColor} w="200px" flexShrink={0} p={1}>
        {challenge.previewImage ? (
          <Image src={challenge.previewImage} objectFit="cover" />
        ) : (
          <Text p={3} textAlign="center">
            {challengeId} image
          </Text>
        )}
      </Center>
      <Flex pt={6} pb={4} px={4} direction="column" grow={1}>
        <Flex justify="space-between" pb={4}>
          <Text fontWeight="bold">{challenge.label}</Text>
          {isRampUpChallenge && challengeStatus && (
            <Badge borderRadius="xl" colorScheme={colorScheme} textTransform="none" py={0.5} px={2.5}>
              {label}
            </Badge>
          )}
        </Flex>
        <Text color={secondaryFontColor} mb={4}>
          {challenge.description}
        </Text>
        <Spacer />
        {challenge.externalLink?.link ? (
          // Redirect to externalLink if set (instead of challenge detail view)
          <ButtonGroup>
            <Button
              as={isChallengeLocked ? Button : Link}
              href={isChallengeLocked ? null : challenge.externalLink?.link}
              isDisabled={isChallengeLocked}
              variant={isChallengeLocked ? "outline" : "solid"}
              isFullWidth
              isExternal
            >
              {builderHasCompletedDependenciesChallenges ? (
                <chakra.span>{challenge.externalLink.claim}</chakra.span>
              ) : (
                <>
                  <span role="img" aria-label="lock icon">
                    🔒
                  </span>
                  <chakra.span ml={1}>Locked</chakra.span>
                </>
              )}
            </Button>
            {!builderHasCompletedDependenciesChallenges && (
              <Tooltip label={lockReasonToolTip}>
                <IconButton icon={<QuestionOutlineIcon />} />
              </Tooltip>
            )}
          </ButtonGroup>
        ) : (
          <ButtonGroup>
            <Button
              as={RouteLink}
              to={!isChallengeLocked && `/challenge/${challengeId}`}
              isDisabled={isChallengeLocked}
              variant={isChallengeLocked ? "outline" : "solid"}
              isFullWidth
            >
              {!isChallengeLocked ? (
                <>
                  {" "}
                  <span role="img" aria-label="castle icon">
                    ⚔️
                  </span>
                  <chakra.span ml={1}>Quest</chakra.span>
                </>
              ) : (
                <>
                  <span role="img" aria-label="lock icon">
                    🔒
                  </span>
                  <chakra.span ml={1}>Locked</chakra.span>
                </>
              )}
            </Button>
            {!builderHasCompletedDependenciesChallenges && (
              <Tooltip label={lockReasonToolTip}>
                <IconButton icon={<QuestionOutlineIcon />} />
              </Tooltip>
            )}
          </ButtonGroup>
        )}
      </Flex>
    </Flex>
  );
};

export default ChallengeExpandedCard;
