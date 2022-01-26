import React, { useMemo } from "react";
import { Container, Box, Text } from "@chakra-ui/react";
import ChallengeExpandedCard from "../components/ChallengeExpandedCard";
import { challengeInfo } from "../data/challenges";
import useCustomColorModes from "../hooks/useCustomColorModes";
import { CHALLENGE_SUBMISSION_STATUS } from "../helpers/constants";

export default function HomeView({ connectedBuilder }) {
  const { primaryFontColor } = useCustomColorModes();

  const builderCompletedChallenges = useMemo(() => {
    if (!connectedBuilder?.challenges) {
      return [];
    }

    return Object.keys(connectedBuilder.challenges).filter(
      challengeId => connectedBuilder.challenges[challengeId].status === CHALLENGE_SUBMISSION_STATUS.ACCEPTED,
    );
  }, [connectedBuilder]);

  return (
    <Container maxW="container.lg" centerContent>
      <Text color={primaryFontColor} mb="12" fontSize="xl" textAlign="center">
        <span role="img" aria-label="teacher icon">
          👩‍🏫
        </span>{" "}
        Learn how to build on Ethereum; the superpowers and the gotchas.
      </Text>
      <Text color={primaryFontColor} mb="12" fontSize="xl" textAlign="center">
        <span role="img" aria-label="mage icon">
          🧙‍♀️
        </span>{" "}
        Craft your web3 portfolio and meet other builders.
      </Text>

      <Box>
        {Object.entries(challengeInfo).map(([challengeId, challenge], index) => (
          <ChallengeExpandedCard
            challengeId={challengeId}
            challenge={challenge}
            challengeIndex={index}
            builderCompletedChallenges={builderCompletedChallenges}
          />
        ))}
      </Box>
    </Container>
  );
}
