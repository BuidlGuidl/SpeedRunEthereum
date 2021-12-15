import React from "react";
import { Container, Box, Text } from "@chakra-ui/react";
import ChallengeExpandedCard from "../components/ChallengeExpandedCard";
// ToDo. Ignoring challenge sequence for now.
import { challengeInfo } from "../data/challenges";
import useCustomColorModes from "../hooks/useCustomColorModes";

export default function HomeView() {
  const { primaryFontColor } = useCustomColorModes();
  return (
    <Container maxW="container.md" centerContent>
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
          <ChallengeExpandedCard challengeId={challengeId} challenge={challenge} challengeIndex={index} />
        ))}
      </Box>
    </Container>
  );
}
