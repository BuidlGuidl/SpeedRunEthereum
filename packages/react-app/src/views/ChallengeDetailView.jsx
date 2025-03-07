import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tabs,
  TabPanels,
  TabPanel,
  Tooltip,
  SkeletonText,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import rehypeRaw from "rehype-raw";

import { challengeInfo } from "../data/challenges";
import ChallengeSubmission from "../components/ChallengeSubmission";
import { chakraMarkdownComponents } from "../helpers/chakraMarkdownTheme";
import { USER_ROLES, CHALLENGE_REPO } from "../helpers/constants";
import { getChallengeReadme } from "../data/api";
import { parseGithubReadme } from "../helpers/strings";

export default function ChallengeDetailView({ serverUrl, address, userProvider, userRole, loadWeb3Modal }) {
  const [challengeDescription, setChallengeDescription] = useState(null);
  const { challengeId } = useParams();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openModalOnLoad, setOpenModalOnLoad] = useState(false);
  const bgColor = useColorModeValue("sre.cardBackground", "sreDark.cardBackground");

  const challenge = challengeInfo[challengeId];
  const isWalletConnected = !!userRole;
  const isAnonymous = userRole && USER_ROLES.anonymous === userRole;

  // Fetch challenge description from local files.
  // In the future, this might be a fetch to the repos/branchs README
  // (Ideally fetched at build time)
  useEffect(() => {
    getChallengeReadme(challengeId)
      .then(text => setChallengeDescription(parseGithubReadme(text)))
      .catch(() => setChallengeDescription(null));
  }, [challengeId, challenge]);

  useEffect(() => {
    if (!isWalletConnected || isAnonymous) return;

    if (openModalOnLoad) {
      onOpen();
      setOpenModalOnLoad(false);
    }
  }, [isAnonymous, isWalletConnected, onOpen, userRole, openModalOnLoad, setOpenModalOnLoad]);

  if (!challenge) {
    history.push("/404");
    return null;
  }

  const handleSubmitChallengeModal = async () => {
    if (isWalletConnected && !isAnonymous) {
      return onOpen();
    }

    if (!isWalletConnected) {
      await loadWeb3Modal();
      setOpenModalOnLoad(true);
    }
  };

  const challengeActionButtons = () => {
    return (
      <>
        <Box textAlign="center">
          <Button
            as="a"
            colorScheme="gray"
            variant="outline"
            href={`${CHALLENGE_REPO}/tree/${challenge.branchName}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View it on Github <ExternalLinkIcon ml={1} />
          </Button>
        </Box>
        <Box pos="sticky" bottom={0} p={6} left={0} right={0} textAlign="center">
          <Tooltip label={isAnonymous ? "You need to register as a builder" : "Submit Challenge"} shouldWrapChildren>
            <Button colorScheme="green" boxShadow="dark-lg" onClick={handleSubmitChallengeModal} disabled={isAnonymous}>
              Submit challenge
            </Button>
          </Tooltip>
        </Box>
      </>
    );
  };

  return (
    <Box bgColor={bgColor} py={12}>
      {/* Magic number for maxW to match GitHub */}
      <Container maxW="894px" mb="60px">
        <Tabs align="center" colorScheme="green">
          <TabPanels align="left">
            <TabPanel>
              <SkeletonText mt="4" noOfLines={4} spacing="4" isLoaded={challengeDescription} />
              <ReactMarkdown components={ChakraUIRenderer(chakraMarkdownComponents)} rehypePlugins={[rehypeRaw]}>
                {challengeDescription}
              </ReactMarkdown>
              {challengeActionButtons()}
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
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
                loadWeb3Modal={loadWeb3Modal}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}
