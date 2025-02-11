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
import NewIcon from "./icons/NewIcon";

const ChallengeExpandedCard = ({
  challengeId,
  challenge,
  connectedBuilder,
  builderAttemptedChallenges,
  userProvider,
  isFirst = false,
  isLast = false,
  challengeIndex,
}) => {
  const { borderColor, bgColor, primaryFontColor } = useCustomColorModes();
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
  const isChallengeComingSoon = challenge.comingSoon;

  if (challenge.checkpoint) {
    return (
      <Center
        bg="sre.bgBannerBackground"
        bgImg="assets/bgBanner_castlePlatform.svg"
        backgroundPosition="bottom center"
        backgroundRepeat="repeat-x"
        backgroundSize={{ base: "150%", lg: "auto" }}
        position="relative"
        overflow="hidden"
      >
        <Image
          src="assets/bgBanner_joinBgClouds.svg"
          position="absolute"
          top={{ base: "6%", lg: "5%" }}
          left={{ base: "4%", lg: "auto" }}
          zIndex={100}
        />
        <VStack
          maxW="7xl"
          py={8}
          ml={14}
          mr={14}
          pl={10}
          borderLeft="solid 5px"
          borderColor={borderColor}
          position="relative"
          spacing={{ base: 16, lg: 32 }}
          minH={{ base: "md", lg: "lg" }}
        >
          <Center position="relative" mt={{ base: 2, lg: 8 }}>
            <Image src="assets/bgBanner_JoinBG.svg" w="820px" />
          </Center>
          <Flex justifyContent="space-between" direction={{ base: "column", lg: "row" }}>
            <Text mb={4} color="sre.text" textAlign={{ base: "center", lg: "left" }} maxW={{ base: "100%", lg: "35%" }}>
              {challenge.description}
            </Text>
            <ButtonGroup alignSelf="flex-end" alignItems="center">
              {builderHasCompletedDependenciesChallenges ? (
                <JoinBG
                  text={challenge.externalLink.claim}
                  isChallengeLocked={isChallengeLocked}
                  userProvider={userProvider}
                  connectedBuilder={connectedBuilder}
                />
              ) : (
                <Button
                  variant="solid"
                  fontSize={{ base: "xl", lg: "lg" }}
                  border="2px"
                  backgroundColor="sreDark.default"
                  disabled={true}
                  borderColor="sre.default"
                  py="1rem"
                  px={4}
                >
                  <Flex justifyContent="center" alignItems="center">
                    <PadLockIcon w={6} h={6} />
                    <chakra.span color="sre.text" ml={2} textTransform="uppercase" fontWeight="medium">
                      Locked
                    </chakra.span>
                  </Flex>
                </Button>
              )}

              {!builderHasCompletedDependenciesChallenges && (
                <Tooltip label={lockReasonToolTip}>
                  <chakra.span _hover={{ cursor: "pointer" }}>
                    <QuestionIcon
                      h={8}
                      w={8}
                      sx={{
                        path: {
                          fill: "sre.default",
                        },
                      }}
                    />
                  </chakra.span>
                </Tooltip>
              )}
            </ButtonGroup>
          </Flex>
          <chakra.span
            h={5}
            w={5}
            rounded="full"
            backgroundColor={bgColor}
            border="4px"
            borderColor={borderColor}
            position="absolute"
            top={{
              base: "22%",
              lg: "30%",
            }}
            left="-13px"
          />
          {challenge.icon && (
            <chakra.span
              h="20px"
              w="20px"
              backgroundImage={challenge.icon}
              backgroundRepeat="no-repeat"
              backgroundSize="20px auto"
              position="absolute"
              top={{
                base: "22%",
                lg: "30%",
              }}
              left="-40px"
            />
          )}
        </VStack>
      </Center>
    );
  }

  return (
    <Center borderColor={borderColor}>
      <Flex
        justifyContent="space-between"
        maxW="7xl"
        py={8}
        ml={14}
        mr={14}
        pl={10}
        borderLeft="solid 5px"
        borderColor={borderColor}
        // Magic number (challengeIndex === 2). Challenge before Join the BG
        borderBottom={isLast || challengeIndex === 4 ? 0 : "2px"}
        borderBottomColor={borderColor}
        position="relative"
        direction={{
          base: "column-reverse",
          lg: "row",
        }}
        _after={
          isFirst && {
            content: `""`,
            position: "absolute",
            left: "-12px",
            zIndex: "1",
            top: "0",
            width: "18px",
            height: {
              base: "58%",
              lg: "50%",
            },
            background: cardBgColor,
          }
        }
      >
        <VStack
          alignItems="start"
          maxWidth={{ base: "100%", lg: "40%" }}
          spacing={{
            base: 18,
            lg: 20,
          }}
        >
          <VStack alignItems="start" spacing={0}>
            {challengeStatus && (
              <Badge borderRadius="xl" colorScheme={colorScheme} textTransform="none" py={0.5} px={2.5}>
                {label}
              </Badge>
            )}

            <Text color={primaryFontColor} fontSize={{ base: "xl", lg: "lg" }}>
              Challenge #{challengeIndex}
            </Text>
            <Text fontSize={{ base: "3xl", lg: "2xl" }} color={primaryFontColor} mt={0} fontWeight="bold">
              {challenge.label.split(": ")[1] ? challenge.label.split(": ")[1] : challenge.label}
            </Text>
          </VStack>
          <VStack alignItems="start" spacing={8}>
            <Text color={primaryFontColor} fontSize={{ base: "lg", lg: "md" }}>
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
                  fontSize={{ base: "xl", lg: "lg" }}
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
                  to={!isChallengeLocked && !isChallengeComingSoon && `/challenge/${challengeId}`}
                  isDisabled={isChallengeLocked || isChallengeComingSoon}
                  variant={isChallengeLocked ? "outline" : "solid"}
                  fontSize={{ base: "xl", lg: "lg" }}
                  border="2px"
                  backgroundColor={bgColor}
                  borderColor={borderColor}
                  py="1rem"
                  px={4}
                >
                  {isChallengeComingSoon ? (
                    <Flex justifyContent="center">
                      <NewIcon w={6} h={6} />
                      <chakra.span color={primaryFontColor} ml={2} textTransform="uppercase" fontWeight="medium">
                        Coming Soon
                      </chakra.span>
                    </Flex>
                  ) : !isChallengeLocked ? (
                    <Flex justifyContent="center" alignItems="center">
                      <CrossedSwordsIcon w={6} h={6} />
                      <chakra.span color={primaryFontColor} ml={2} textTransform="uppercase" fontWeight="medium">
                        Quest
                      </chakra.span>
                    </Flex>
                  ) : (
                    <Flex justifyContent="center">
                      <PadLockIcon w={6} h={6} />
                      <chakra.span color={primaryFontColor} ml={2} textTransform="uppercase" fontWeight="medium">
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
        <Box
          d="flex"
          justifyContent="center"
          alignItems="center"
          mb={{
            base: 6,
            lg: 0,
          }}
        >
          {challenge.previewImage ? (
            <Image
              src={challenge.previewImage}
              alt={challenge.label}
              maxW={{ lg: "490px" }}
              mr={{ base: 0, lg: "50px" }}
            />
          ) : (
            <Text p={3} textAlign="center">
              {challengeId} image
            </Text>
          )}
        </Box>
        <chakra.span
          h={5}
          w={5}
          rounded="full"
          backgroundColor={bgColor}
          border="4px"
          borderColor={borderColor}
          position="absolute"
          top={{
            base: "58%",
            lg: "50%",
          }}
          left="-13px"
        />
        {challenge.icon && (
          <chakra.span
            h="24px"
            w="20px"
            backgroundImage={challenge.icon}
            backgroundRepeat="no-repeat"
            backgroundSize="20px auto"
            position="absolute"
            top={{
              base: "58%",
              lg: "50%",
            }}
            left="-40px"
          />
        )}
      </Flex>
    </Center>
  );
};

export default ChallengeExpandedCard;
