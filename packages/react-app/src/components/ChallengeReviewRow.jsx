import React from "react";
import { Link as RouteLink } from "react-router-dom";
import moment from "moment";
import {
  chakra,
  Box,
  Button,
  Link,
  Td,
  Tr,
  Th,
  Textarea,
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
import { challengeInfo } from "../data/challenges";
import { chakraMarkdownComponents } from "../helpers/chakraMarkdownTheme";

export default function ChallengeReviewRow({ challenge, submittedTimestamp, isLoading, approveClick, rejectClick }) {
  const [comment, setComment] = React.useState(challenge.reviewComment ?? "");
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!challengeInfo[challenge.id]) {
    return null;
  }

  // We asume that rejected challenges will always have review Comments.
  // ToDo. Use the stored events.
  const isResubmitted = !!challenge.reviewComment;

  const challengeReviewDisplay = (
    <Link as={RouteLink} to={`/challenge/${challenge.id}`}>
      {challengeInfo[challenge.id].label}
      {isResubmitted && (
        <>
          <br />
          <Text fontSize="xs">(Resubmitted)</Text>
        </>
      )}
    </Link>
  );

  const submittedMoment = moment(submittedTimestamp);

  const reviewRow = (
    <>
      <Td>
        <Link as={RouteLink} to={`/builders/${challenge.userAddress}`} pos="relative">
          <Address address={challenge.userAddress} w="12.5" fontSize="16" />
        </Link>
      </Td>
      <Td>{challengeReviewDisplay}</Td>
      <Td>
        <Link
          // Legacy branchUrl
          href={challenge.contractUrl || challenge.branchUrl}
          color="teal.500"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contract
        </Link>
      </Td>
      <Td>
        <Link href={challenge.deployedUrl} color="teal.500" target="_blank" rel="noopener noreferrer">
          Demo
        </Link>
      </Td>
      <Td>
        <Tooltip label={submittedMoment.format("YYYY-MM-DD, HH:mm")}>
          <Box cursor="pointer">{submittedMoment.fromNow()}</Box>
        </Tooltip>
      </Td>
    </>
  );

  return (
    <Tr>
      {reviewRow}
      <Td>
        <Button type="button" colorScheme="blue" disabled={isLoading} className="danger" onClick={onOpen} size="xs">
          Send review
        </Button>
      </Td>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
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
