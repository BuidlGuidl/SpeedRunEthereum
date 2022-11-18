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
  Box,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";

import useCustomColorModes from "../hooks/useCustomColorModes";
import { CHALLENGE_SUBMISSION_STATUS } from "../helpers/constants";
import JoinBG from "./JoinBG";

const ChallengeExpandedCard = ({
  challengeId,
  challenge,
  connectedBuilder,
  builderAttemptedChallenges,
  userProvider,
  isFirst = false,
}) => {
  const { borderColor, secondaryFontColor, bgColor, primaryFontColor } = useCustomColorModes();
  const checkpointBgColor = useColorModeValue("#f9f9f9", "#000000");
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
      <Box bg={checkpointBgColor}>
        <Flex maxW={500} overflow="hidden" m="0 auto 24px" opacity={isChallengeLocked ? "0.5" : "1"}>
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
                  <IconButton icon={<QuestionOutlineIcon />} />
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
        <VStack alignItems="start" maxWidth="40%" spacing={24}>
          <VStack alignItems="start" spacing={0}>
            <Text color={primaryFontColor} fontSize="xl">
              Challenge #0
            </Text>
            <Text fontSize="3xl" color={primaryFontColor} mt={0}>
              Simple NFT Example
            </Text>
          </VStack>
          <VStack alignItems="start" spacing={8}>
            <Text color={primaryFontColor} fontSize="lg">
              🎫 Create a simple NFT to learn basics of 🏗 scaffold-eth. You'll use 👷‍♀️ HardHat to compile and deploy
              smart contracts. Then, you'll use a template React app full of important Ethereum components and hooks.
              Finally, you'll deploy an NFT to a public network to share with friends! 🚀
            </Text>
            <Button
              as={RouteLink}
              to={!isChallengeLocked && `/challenge/${challengeId}`}
              isDisabled={isChallengeLocked}
              variant={isChallengeLocked ? "outline" : "solid"}
              backgroundColor={bgColor}
              borderRadius="3xl"
              fontSize="xl"
              border="2px"
              borderColor={borderColor}
            >
              {!isChallengeLocked ? (
                <>
                  {" "}
                  <span role="img" aria-label="castle icon">
                    ⚔️
                  </span>
                  <chakra.span ml={1} color={primaryFontColor}>
                    Quest
                  </chakra.span>
                </>
              ) : (
                <>
                  <span role="img" aria-label="lock icon">
                    🔒
                  </span>
                  <chakra.span ml={1} color={primaryFontColor}>
                    Locked
                  </chakra.span>
                </>
              )}
            </Button>
          </VStack>
        </VStack>
        <Box>
          <img src="/assets/challenges/simpleNFT.svg" alt="simpleNFT" />
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

{
  /* <Flex borderWidth="1px" borderRadius="lg" borderColor={borderColor} overflow="hidden" mb={6}>
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
          {challengeStatus && (
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
    </Flex> */
}
