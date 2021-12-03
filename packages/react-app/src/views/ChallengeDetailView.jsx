import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
import { USER_ROLES, JS_CHALLENGE_REPO, TS_CHALLENGE_REPO } from "../helpers/constants";

export default function ChallengeDetailView({ serverUrl, address, userProvider, userRole }) {
  const [descriptionJs, setDescriptionJs] = useState(null);
  const [descriptionTs, setDescriptionTs] = useState(null);
  const { challengeId } = useParams();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const challenge = challengeInfo[challengeId];

  // Fetch challenge description from local files.
  // In the future, this might be a fetch to the repos/branchs README
  // (Ideally fetched at build time)
  useEffect(() => {
    import(`../data/challenges/${challengeId}.md`)
      .then(file => {
        fetch(file.default)
          .then(content => content.text())
          .then(text => setDescriptionJs(text))
          .catch(() => setDescriptionJs(challenge.description));
      })
      .catch(() => setDescriptionJs(challenge.description));

    import(`../data/challenges/${challengeId}.ts.md`)
      .then(file => {
        fetch(file.default)
          .then(content => content.text())
          .then(text => setDescriptionTs(text))
          .catch(() => setDescriptionTs(challenge.description));
      })
      .catch(() => setDescriptionTs(challenge.description));
  }, [challengeId, challenge]);

  if (!challenge) {
    // TODO implement a 404 page
    // this looks good: https://ant.design/components/result/#components-result-demo-404
    history.push("/404");
  }

  const canSubmit = USER_ROLES.anonymous !== userRole;
  const challengeActionButtons = (type = "JS") => {
    const repo = type === "JS" ? JS_CHALLENGE_REPO : TS_CHALLENGE_REPO;
    return (
      <Box>
        <Button
          as="a"
          colorScheme="gray"
          variant="outline"
          href={`${repo}/tree/${challenge.branchName}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View it on Github <ExternalLinkIcon ml={1} />
        </Button>
        <Box pos="fixed" bottom={0} p={6} left={0} right={0}>
          <Tooltip label={canSubmit ? "Submit Challenge" : "You need to register as a builder"} shouldWrapChildren>
            <Button colorScheme="blue" boxShadow="dark-lg" onClick={onOpen} disabled={!canSubmit}>
              Submit challenge
            </Button>
          </Tooltip>
        </Box>
      </Box>
    );
  };

  return (
    <Container maxW="container.md" mb="60px">
      <Box textAlign="center" mb={6}>
        <Heading as="h1" mb={4}>
          {challenge.label}
        </Heading>
      </Box>
      <Tabs variant="enclosed-colored" align="center">
        <TabList>
          <Tab>Javascript</Tab>
          <Tab>Typescript</Tab>
        </TabList>
        <TabPanels align="left">
          <TabPanel>
            <SkeletonText mt="4" noOfLines={4} spacing="4" isLoaded={descriptionJs} />
            <ReactMarkdown components={ChakraUIRenderer(chakraMarkdownComponents)}>{descriptionJs}</ReactMarkdown>
            <Box textAlign="center" my={6}>
              {challengeActionButtons("JS")}
            </Box>
          </TabPanel>
          <TabPanel>
            <SkeletonText mt="4" noOfLines={4} spacing="4" isLoaded={descriptionTs} />
            <ReactMarkdown components={ChakraUIRenderer(chakraMarkdownComponents)}>{descriptionTs}</ReactMarkdown>
            <Box textAlign="center" my={6}>
              {challengeActionButtons("TS")}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
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
