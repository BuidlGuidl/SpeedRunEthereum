import React, { useState } from "react";
import { Link as RouteLink } from "react-router-dom";
import moment from "moment";
import {
  chakra,
  Button,
  Link,
  Td,
  Tr,
  Th,
  Textarea,
  Flex,
  Badge,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Modal,
  Table,
  Thead,
  Tbody,
  Text,
  Tooltip,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import Address from "./Address";
import DateWithTooltip from "./DateWithTooltip";
import { challengeInfo } from "../data/challenges";
import { chakraMarkdownComponents } from "../helpers/chakraMarkdownTheme";
import { runAutograderTest } from "../data/api";
import { useUserAddress } from "eth-hooks";
import { isBoolean } from "../helpers/strings";

export default function ChallengeReviewRow({ challenge, isLoading, approveClick, rejectClick, userProvider }) {
  const [comment, setComment] = useState(challenge.reviewComment ?? "");
  const [testPassed, setTestPassed] = useState(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const address = useUserAddress(userProvider);

  if (!challengeInfo[challenge.id]) {
    return null;
  }

  // We asume that rejected challenges will always have review Comments.
  const isAutograded = challenge.autograding;
  // ToDo. Use the stored events.
  const isResubmitted = !isAutograded && !!challenge.reviewComment;

  const runTests = async () => {
    try {
      console.log("Testing challenge with the auto-grader");

      setIsRunningTests(true);
      setTestPassed(null);

      const result = await runAutograderTest(challenge.id, challenge.contractUrl, address);
      const resultData = result.data;

      console.log("Testing results", resultData);
      setTestPassed(resultData.success);
      setComment(resultData.feedback ?? resultData.error);
    } catch (e) {
      console.log("Error calling the auto-grader", e);
    } finally {
      setIsRunningTests(false);
    }
  };

  const challengeReviewDisplay = (
    <Link as={RouteLink} to={`/challenge/${challenge.id}`}>
      {challengeInfo[challenge.id].label}
      {isResubmitted && (
        <>
          <br />
          <Text fontSize="xs">(Resubmitted)</Text>
        </>
      )}
      {isAutograded && (
        <>
          <br />
          <Text fontSize="xs" color="orange.500">
            (Autograded)
          </Text>
        </>
      )}
    </Link>
  );

  const submittedMoment = moment(challenge.submittedTimestamp);

  const reviewRow = (
    <>
      <Td>
        <Link as={RouteLink} to={`/builders/${challenge.userAddress}`} pos="relative">
          <Address address={challenge.userAddress} w="12.5" fontSize="16" />
        </Link>
      </Td>
      <Td>{challengeReviewDisplay}</Td>
      <Td>
        <DateWithTooltip timestamp={challenge.submittedTimestamp} />
      </Td>
    </>
  );

  return (
    <Tr>
      {reviewRow}
      <Td>
        <Button type="button" colorScheme="blue" disabled={isLoading} className="danger" onClick={onOpen} size="xs">
          Review
        </Button>
      </Td>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="56rem">
          <ModalHeader>Review Challenge</ModalHeader>
          <ModalCloseButton />
          <Table mb={4}>
            <Thead>
              <Tr>
                <Th>Builder</Th>
                <Th>Challenge & Links</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>
                  <Link as={RouteLink} to={`/builders/${challenge.userAddress}`} pos="relative">
                    <Address address={challenge.userAddress} w="12.5" fontSize="16" />
                  </Link>
                </Td>
                <Td>
                  {challengeReviewDisplay}
                  <UnorderedList>
                    <ListItem>
                      <Link
                        // Legacy branchUrl
                        href={challenge.contractUrl || challenge.branchUrl}
                        color="teal.500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Contract
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link href={challenge.deployedUrl} color="teal.500" target="_blank" rel="noopener noreferrer">
                        Demo
                      </Link>
                    </ListItem>
                    <ListItem>
                      Submitted{" "}
                      <Tooltip label={submittedMoment.format("YYYY-MM-DD, HH:mm")}>
                        <chakra.span cursor="pointer">{submittedMoment.fromNow()}</chakra.span>
                      </Tooltip>
                    </ListItem>
                    <ListItem listStyleType="none" mt={2}>
                      <Flex align="center">
                        <Button onClick={runTests} isLoading={isRunningTests} mr={2}>
                          Run tests
                        </Button>
                        {isBoolean(testPassed) && (
                          <Badge colorScheme={testPassed ? "green" : "red"}>
                            {testPassed ? "Accepted" : "Rejected"}
                          </Badge>
                        )}
                      </Flex>
                    </ListItem>
                  </UnorderedList>
                </Td>
              </Tr>
            </Tbody>
          </Table>
          <ModalBody px={6} pb={0}>
            <Tabs variant="enclosed-colored">
              <TabList>
                <Tab>Write</Tab>
                <Tab>Preview</Tab>
              </TabList>
              <TabPanels align="left">
                <TabPanel p={0}>
                  <Textarea
                    onChange={e => {
                      const value = e.target.value;
                      setComment(value);
                    }}
                    placeholder="Comment"
                    style={{ marginBottom: 10 }}
                    rows={10}
                    value={comment}
                    borderTopRadius={0}
                  />
                </TabPanel>
                <TabPanel>
                  <ReactMarkdown components={ChakraUIRenderer(chakraMarkdownComponents)}>{comment}</ReactMarkdown>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              colorScheme="red"
              disabled={isLoading}
              className="danger"
              onClick={() => rejectClick(challenge.userAddress, challenge.id, comment)}
              size="sm"
              isFullWidth
            >
              Reject
            </Button>
            <Button
              type="button"
              colorScheme="green"
              disabled={isLoading}
              ml={3}
              onClick={() => approveClick(challenge.userAddress, challenge.id, comment)}
              size="sm"
              isFullWidth
            >
              Approve
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Tr>
  );
}
