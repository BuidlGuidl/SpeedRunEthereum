import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Container, Heading } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { challengeInfo } from "../data/challenges";
import ChallengeSubmission from "../components/ChallengeSubmission";
import { chakraMarkdownComponents } from "../helpers/chakraMarkdownTheme";

export default function ChallengeDetailView({ serverUrl, address, userProvider }) {
  const [description, setDescription] = useState("");
  const { challengeId } = useParams();
  const history = useHistory();
  const challenge = challengeInfo[challengeId];

  // Fetch challenge description
  useEffect(() => {
    import(`../data/challenges/${challengeId}.md`)
      .then(file => {
        fetch(file.default)
          .then(content => content.text())
          .then(text => setDescription(text))
          .catch(() => setDescription(challenge.description));
      })
      .catch(() => setDescription(challenge.description));
  }, []);

  if (!challenge) {
    // TODO implement a 404 page
    // this looks good: https://ant.design/components/result/#components-result-demo-404
    history.push("/404");
  }

  return (
    <Container maxW="container.lg">
      <Container maxW="container.md" centerContent mb={4}>
        <Heading as="h1" mb="2">
          {challenge.label}
        </Heading>
        <Button
          as="a"
          colorScheme="gray"
          variant="outline"
          href={challenge.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View it on Github <ExternalLinkIcon ml={1} />
        </Button>
      </Container>
      <ReactMarkdown components={ChakraUIRenderer(chakraMarkdownComponents)}>{description}</ReactMarkdown>
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
