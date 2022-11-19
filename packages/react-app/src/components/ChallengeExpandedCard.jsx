import React from "react";
import { Link as RouteLink } from "react-router-dom";
import {
  chakra,
  ButtonGroup,
  Button,
  Tooltip,
  Center,
  Image,
  Flex,
  Spacer,
  Text,
  Link,
  Badge,
  Box,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

import useCustomColorModes from "../hooks/useCustomColorModes";
import { CHALLENGE_SUBMISSION_STATUS } from "../helpers/constants";
import JoinBG from "./JoinBG";
import CrossedSwordsIcon from "./icons/CrossedSwordsIcon";
import PadLockIcon from "./icons/PadLockIcon";
import QuestionIcon from "./icons/QuestionIcon";

const ChallengeExpandedCard = ({
  challengeId,
  challenge,
  connectedBuilder,
  builderAttemptedChallenges,
  userProvider,
  isFirst = false,
}) => {
  const { borderColor, secondaryFontColor, bgColor, primaryFontColor } = useCustomColorModes();
  const cardBgColor = useColorModeValue("sre.cardBackground", "sreDark.cardBackground");

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

  if (challenge.checkpoint) {
    return (
      <Box bg={bgColor} borderBottom="2px" borderColor={borderColor}>
        <Flex maxW={500} overflow="hidden" m="0 auto" opacity={isChallengeLocked ? "0.5" : "1"}>
          <Flex pt={6} pb={4} px={4} direction="column" grow={1}>
            <Flex alignItems="center" pb={4} direction="column">
              <Text fontWeight="bold" fontSize="lg" mb={2}>
                {challenge.label}
              </Text>
              <Center borderBottom="1px" borderColor={borderColor} w="200px" flexShrink={0} p={1}>
                <Image src={challenge.previewImage} objectFit="cover" />
              </Center>
            </Flex>
            <Text color={secondaryFontColor} mb={4} textAlign="center">
              {challenge.description}
            </Text>
            <Spacer />
            <ButtonGroup>
              {builderHasCompletedDependenciesChallenges ? (
                <JoinBG
                  text={challenge.externalLink.claim}
                  isChallengeLocked={isChallengeLocked}
                  userProvider={userProvider}
                  connectedBuilder={connectedBuilder}
                />
              ) : (
                <Button
                  isDisabled={isChallengeLocked}
                  variant={isChallengeLocked ? "outline" : "solid"}
                  isFullWidth
                  isExternal
                >
                  <span role="img" aria-label="lock icon">
                    🔒
                  </span>
                  <chakra.span ml={1}>Locked</chakra.span>
                </Button>
              )}

              {!builderHasCompletedDependenciesChallenges && (
                <Tooltip label={lockReasonToolTip}>
                  <chakra.span _hover={{ cursor: "pointer" }}>
                    <QuestionIcon h={8} w={8} />
                  </chakra.span>
                </Tooltip>
              )}
            </ButtonGroup>
          </Flex>
        </Flex>
      </Box>
    );
  }

  return (
    <Box borderBottom="2px" borderColor={borderColor} backgroundColor={cardBgColor}>
      <Flex
        justifyContent="space-between"
        py={8}
        ml={14}
        pl={10}
        borderLeft="4px"
        borderColor={borderColor}
        position="relative"
        _after={
          isFirst && {
            content: `""`,
            position: "absolute",
            left: "-4px",
            zIndex: "100",
            top: "0",
            width: "4px",
            height: "50%",
            background: cardBgColor,
          }
        }
      >
        <VStack alignItems="start" maxWidth="40%" spacing={isFirst ? 32 : 24}>
          <VStack alignItems="start" spacing={0}>
            {challengeStatus && (
              <Badge borderRadius="xl" colorScheme={colorScheme} textTransform="none" py={0.5} px={2.5}>
                {label}
              </Badge>
            )}

            <Text color={primaryFontColor} fontSize="xl">
              Challenge #{challenge.id}
            </Text>
            <Text fontSize="3xl" color={primaryFontColor} mt={0}>
              {/* {challenge.label} */} Simple NFT Example
            </Text>
          </VStack>
          <VStack alignItems="start" spacing={8}>
            <Text color={primaryFontColor} fontSize="lg">
              {challenge.description}
            </Text>
            {challenge.externalLink?.link ? (
              // Redirect to externalLink if set (instead of challenge detail view)
              <ButtonGroup alignItems="center">
                <Button
                  as={isChallengeLocked ? Button : Link}
                  href={isChallengeLocked ? null : challenge.externalLink?.link}
                  isDisabled={isChallengeLocked}
                  variant={isChallengeLocked ? "outline" : "solid"}
                  borderRadius="3xl"
                  fontSize="xl"
                  border="2px"
                  backgroundColor={bgColor}
                  borderColor={borderColor}
                  isExternal
                  py="1.25rem"
                  px={6}
                >
                  {builderHasCompletedDependenciesChallenges ? (
                    <chakra.span color={primaryFontColor}>{challenge.externalLink.claim}</chakra.span>
                  ) : (
                    <Flex justifyContent="center">
                      <PadLockIcon w={6} h={6} />
                      <chakra.span color={primaryFontColor} ml={2} textTransform="uppercase">
                        Locked
                      </chakra.span>
                    </Flex>
                  )}
                </Button>
                {!builderHasCompletedDependenciesChallenges && (
                  <Tooltip label={lockReasonToolTip}>
                    <chakra.span _hover={{ cursor: "pointer" }}>
                      <QuestionIcon h={8} w={8} />
                    </chakra.span>
                  </Tooltip>
                )}
              </ButtonGroup>
            ) : (
              <ButtonGroup alignItems="center">
                <Button
                  as={RouteLink}
                  to={!isChallengeLocked && `/challenge/${challengeId}`}
                  isDisabled={isChallengeLocked}
                  variant={isChallengeLocked ? "outline" : "solid"}
                  borderRadius="3xl"
                  fontSize="xl"
                  border="2px"
                  backgroundColor={bgColor}
                  borderColor={borderColor}
                  py="1.25rem"
                  px={6}
                >
                  {!isChallengeLocked ? (
                    <Flex justifyContent="center" alignItems="center">
                      <CrossedSwordsIcon w={6} h={6} />
                      <chakra.span color={primaryFontColor} ml={2} textTransform="uppercase">
                        Quest
                      </chakra.span>
                    </Flex>
                  ) : (
                    <Flex justifyContent="center">
                      <PadLockIcon w={6} h={6} />
                      <chakra.span color={primaryFontColor} ml={2} textTransform="uppercase">
                        Locked
                      </chakra.span>
                    </Flex>
                  )}
                </Button>
                {!builderHasCompletedDependenciesChallenges && (
                  <Tooltip label={lockReasonToolTip}>
                    <chakra.span _hover={{ cursor: "pointer" }}>
                      <QuestionIcon h={8} w={8} />
                    </chakra.span>
                  </Tooltip>
                )}
              </ButtonGroup>
            )}
          </VStack>
        </VStack>
        <Box>
          {challenge.previewImage ? (
            <Image src={challenge.previewImage} alt="simpleNFT" />
          ) : (
            <Text p={3} textAlign="center">
              {challengeId} image
            </Text>
          )}
        </Box>
        <chakra.span
          h={8}
          w={8}
          rounded="full"
          backgroundColor={bgColor}
          border="4px"
          borderColor={borderColor}
          position="absolute"
          top="50%"
          left="-18px"
        />
      </Flex>
    </Box>
  );
};

export default ChallengeExpandedCard;
