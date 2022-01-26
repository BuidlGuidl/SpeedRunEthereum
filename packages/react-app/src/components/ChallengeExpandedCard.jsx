import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { chakra, Button, Center, Image, Flex, Spacer, Text, Link } from "@chakra-ui/react";
import useCustomColorModes from "../hooks/useCustomColorModes";

const ChallengeExpandedCard = ({ challengeId, challenge, builderCompletedChallenges }) => {
  const { borderColor, secondaryFontColor } = useCustomColorModes();
  const builderHasCompletedDependenciesChallenges = challenge.dependencies?.every(id =>
    builderCompletedChallenges.includes(id),
  );

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
        <Text fontWeight="bold" pb={4}>
          {challenge.label}
        </Text>
        <Text color={secondaryFontColor} mb={4}>
          {challenge.description}
        </Text>
        <Spacer />
        {challenge.telegram?.link ? (
          // Redirect to telegram channel if set (instead of challenge detail view)
          <Button
            as={Link}
            href={challenge.telegram?.link}
            isDisabled={challenge.disabled || !builderHasCompletedDependenciesChallenges}
            variant={challenge.disabled ? "outline" : "solid"}
            isFullWidth
            isExternal
          >
            {builderHasCompletedDependenciesChallenges ? (
              <chakra.span>{challenge.telegram.claim}</chakra.span>
            ) : (
              <>
                <span role="img" aria-label="lock icon">
                  🔒
                </span>
                <chakra.span ml={1}>Locked</chakra.span>
              </>
            )}
          </Button>
        ) : (
          <Button
            as={RouteLink}
            to={!challenge.disabled && `/challenge/${challengeId}`}
            isDisabled={challenge.disabled || !builderHasCompletedDependenciesChallenges}
            variant={challenge.disabled ? "outline" : "solid"}
            isFullWidth
          >
            {builderHasCompletedDependenciesChallenges ? (
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
        )}
      </Flex>
    </Flex>
  );
};

export default ChallengeExpandedCard;
