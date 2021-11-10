import React from "react";
import { Container, Box, Heading, Text } from "@chakra-ui/react";
import ChallengeExpandedCard from "../components/ChallengeExpandedCard";
// ToDo. Ignoring challenge sequence for now.
import { challengeInfo } from "../data/challenges";

export default function HomeView() {
  return (
    <Container maxW="container.md" centerContent>
      <Text color="gray.700" mb="12" fontSize="xl" textAlign="center">
        <span role="img" aria-label="castle icon">
          🏃‍♀️
        </span>{" "}
        Speed Run Ethereum aims to provide a structured learning path for onboarding developers to Ethereum with{" "}
        <span role="img" aria-label="crane icon">
          🏗
        </span>
        scaffold-eth
      </Text>
      <Heading as="h2">All Challenges</Heading>
      <Text color="gray.700" mb="6">
        Complete all our Ethereum challenges!
      </Text>
      <Box>
        {Object.entries(challengeInfo).map(([challengeId, challenge], index) => (
          <ChallengeExpandedCard challengeId={challengeId} challenge={challenge} challengeIndex={index} />
        ))}
      </Box>
    </Container>
  );
}
