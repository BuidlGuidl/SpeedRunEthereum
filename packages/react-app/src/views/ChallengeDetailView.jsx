import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { Container, Heading, Link, Text } from "@chakra-ui/react";
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
    <Container>
      <Heading as="h1">{challenge.label}</Heading>
      <Text>{challenge.description}</Text>
      <Link color="teal.500" href={challenge.url} target="_blank" rel="noopener noreferrer">
        Link to challenge
      </Link>
      <ChallengeSubmission challenge={challenge} serverUrl={serverUrl} address={address} userProvider={userProvider} />
    </Container>
  );
}
