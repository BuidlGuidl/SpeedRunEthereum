import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  SkeletonText,
  useDisclosure,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { challengeInfo } from "../data/challenges";
import ChallengeSubmission from "../components/ChallengeSubmission";
import { chakraMarkdownComponents } from "../helpers/chakraMarkdownTheme";
import { USER_ROLES, JS_CHALLENGE_REPO } from "../helpers/constants";

export default function ChallengeDetailView({ serverUrl, address, userProvider, userRole }) {
  const [description, setDescription] = useState(null);
  const { challengeId } = useParams();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  }, [challengeId, challenge]);

  if (!challenge) {
    // TODO implement a 404 page
    // this looks good: https://ant.design/components/result/#components-result-demo-404
    history.push("/404");
  }

  const canSubmit = USER_ROLES.anonymous !== userRole;
  const challengeActionButtons = (
    <ButtonGroup spacing={4}>
      <Button
        as="a"
        colorScheme="gray"
        variant="outline"
        href={`${JS_CHALLENGE_REPO}/tree/${challenge.branchName}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View it on Github <ExternalLinkIcon ml={1} />
      </Button>
      <Tooltip label={canSubmit ? "Submit Challenge" : "You need to register as a builder"} shouldWrapChildren>
        <Button colorScheme="blue" onClick={onOpen} disabled={!canSubmit}>
          Submit challenge
        </Button>
      </Tooltip>
    </ButtonGroup>
  );

  return (
    <Container maxW="container.md" mb={10}>
      <Box textAlign="center" mb={6}>
        <Heading as="h1" mb={4}>
          {challenge.label}
        </Heading>
        {challengeActionButtons}
      </Box>
      <SkeletonText mt="4" noOfLines={4} spacing="4" isLoaded={description} />
      <ReactMarkdown components={ChakraUIRenderer(chakraMarkdownComponents)}>{description}</ReactMarkdown>
      <Box textAlign="center" my={6}>
        {challengeActionButtons}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit Challenge</ModalHeader>
          <ModalCloseButton />
          <ModalBody px={6} pb={8}>
            <ChallengeSubmission
              challenge={challenge}
              serverUrl={serverUrl}
              address={address}
              userProvider={userProvider}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
