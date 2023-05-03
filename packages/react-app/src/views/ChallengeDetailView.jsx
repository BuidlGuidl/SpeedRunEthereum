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
  useColorModeValue,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import rehypeRaw from "rehype-raw";

import { FormattedMessage, useIntl } from "react-intl";
import { getChallengeInfo } from "../data/challenges";
import ChallengeSubmission from "../components/ChallengeSubmission";
import { chakraMarkdownComponents } from "../helpers/chakraMarkdownTheme";
import { USER_ROLES, JS_CHALLENGE_REPO, TS_CHALLENGE_REPO } from "../helpers/constants";
import { getChallengeReadme } from "../data/api";
import { parseGithubReadme } from "../helpers/strings";

export default function ChallengeDetailView({ serverUrl, address, userProvider, userRole, loadWeb3Modal }) {
  const [descriptionJs, setDescriptionJs] = useState(null);
  const [descriptionTs, setDescriptionTs] = useState(null);
  const { challengeId } = useParams();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openModalOnLoad, setOpenModalOnLoad] = useState(false);
  const bgColor = useColorModeValue("sre.cardBackground", "sreDark.cardBackground");

  const intl = useIntl();
  const challengeInfo = getChallengeInfo(intl);
  const challenge = challengeInfo[challengeId];
  const isWalletConnected = !!userRole;
  const isAnonymous = userRole && USER_ROLES.anonymous === userRole;

  // Fetch challenge description from local files.
  // In the future, this might be a fetch to the repos/branchs README
  // (Ideally fetched at build time)
  useEffect(() => {
    getChallengeReadme(challengeId, "js", intl)
      .then(text => setDescriptionJs(parseGithubReadme(text)))
      .catch(() => setDescriptionJs(null));

    getChallengeReadme(challengeId, "ts", intl)
      .then(text => setDescriptionTs(parseGithubReadme(text)))
      .catch(() => setDescriptionTs(null));
  }, [challengeId, challenge, intl]);

  useEffect(() => {
    if (!isWalletConnected || isAnonymous) return;

    if (openModalOnLoad) {
      onOpen();
      setOpenModalOnLoad(false);
    }
  }, [isAnonymous, isWalletConnected, onOpen, userRole, openModalOnLoad, setOpenModalOnLoad]);

  if (!challenge) {
    // TODO implement a 404 page
    // this looks good: https://ant.design/components/result/#components-result-demo-404
    history.push("/404");
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

  const challengeActionButtons = (type = "JS") => {
    const repo = type === "JS" ? JS_CHALLENGE_REPO : TS_CHALLENGE_REPO;
    return (
      <>
        <Box textAlign="center">
          <Button
            as="a"
            colorScheme="gray"
            variant="outline"
            href={`${repo}/tree/${challenge.branchName}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FormattedMessage id="challengeDetailView.github-button" defaultMessage="View it on Github" />{" "}
            <ExternalLinkIcon ml={1} />
          </Button>
        </Box>
        <Box pos="sticky" bottom={0} p={6} left={0} right={0} textAlign="center">
          <Tooltip
            label={
              isAnonymous ? (
                <FormattedMessage
                  id="challengeDetailView.submit-button.tooltip.register"
                  defaultMessage="You need to register as a builder"
                />
              ) : (
                <FormattedMessage id="challengeDetailView.submit-button" defaultMessage="Submit challenge" />
              )
            }
            shouldWrapChildren
          >
            <Button colorScheme="green" boxShadow="dark-lg" onClick={handleSubmitChallengeModal} disabled={isAnonymous}>
              <FormattedMessage id="challengeDetailView.submit-button" defaultMessage="Submit challenge" />
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
        <Box textAlign="center" mb={6}>
          <Heading as="h1" mb={8}>
            {challenge.label}
          </Heading>
        </Box>
        <Tabs align="center" colorScheme="green">
          <TabList>
            {descriptionJs && <Tab>Javascript</Tab>}
            {descriptionTs && <Tab>Typescript</Tab>}
          </TabList>
          <TabPanels align="left">
            <TabPanel>
              <SkeletonText mt="4" noOfLines={4} spacing="4" isLoaded={descriptionJs} />
              <ReactMarkdown components={ChakraUIRenderer(chakraMarkdownComponents)} rehypePlugins={[rehypeRaw]}>
                {descriptionJs}
              </ReactMarkdown>
              {challengeActionButtons("JS")}
            </TabPanel>
            <TabPanel>
              <SkeletonText mt="4" noOfLines={4} spacing="4" isLoaded={descriptionTs} />
              <ReactMarkdown components={ChakraUIRenderer(chakraMarkdownComponents)} rehypePlugins={[rehypeRaw]}>
                {descriptionTs}
              </ReactMarkdown>
              {challengeActionButtons("TS")}
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <FormattedMessage id="challengeDetailView.modal.header" defaultMessage="Submit Challenge" />
            </ModalHeader>
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
