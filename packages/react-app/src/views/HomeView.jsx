import React from "react";
import { Container, SimpleGrid, Heading, Text } from "@chakra-ui/react";
import ChallengeExpandedCard from "../components/ChallengeExpandedCard";
// ToDo. Ignoring challenge secuence for now.
import { challengeInfo } from "../data/challenges";

export default function HomeView() {
  return (
    <Container maxW="container.xl" centerContent>
      <Container maxW="container.md">
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
      </Container>
      <Heading as="h2">All Challenges</Heading>
      <Text color="gray.700" mb="6">
        Complete all our Ethereum challenges!
      </Text>
      <SimpleGrid columns={[1, null, 2, null, 3]} spacing={6} pb={20}>
        {Object.entries(challengeInfo).map(([challengeId, challenge]) => (
          <ChallengeExpandedCard challengeId={challengeId} challenge={challenge} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
