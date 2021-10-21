import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Container, Heading, Text } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { challengeInfo } from "../data/challenges";
import ChallengeSubmission from "../components/ChallengeSubmission";

export default function ChallengeDetailView({ serverUrl, address, userProvider }) {
  const { challengeId } = useParams();
  const history = useHistory();

  const challenge = challengeInfo[challengeId];
  if (!challenge) {
    // TODO implement a 404 page
    // this looks good: https://ant.design/components/result/#components-result-demo-404
    history.push("/404");
  }

  return (
    <Container maxW="container.lg">
      <Container maxW="container.md" centerContent>
        <Heading as="h1" mb="2">
          {challenge.label}
        </Heading>
        <Text color="gray.700" mb="6">
          {challenge.description}
        </Text>
        <Button
          as="a"
          colorScheme="gray"
          variant="outline"
          href={challenge.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Link to challenge <ExternalLinkIcon ml={1} />
        </Button>
      </Container>
      <Container maxW="container.sm" mt={10} centerContent>
        <ChallengeSubmission
          challenge={challenge}
          serverUrl={serverUrl}
          address={address}
          userProvider={userProvider}
        />
      </Container>
    </Container>
  );
}
