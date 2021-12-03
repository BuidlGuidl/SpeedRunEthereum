import React from "react";
import { Link as RouteLink } from "react-router-dom";
import {
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
} from "@chakra-ui/react";
import { challengeInfo } from "../data/challenges";
import Address from "./Address";

export default function ChallengeReviewRow({ challenge, isLoading, approveClick, rejectClick }) {
  const [comment, setComment] = React.useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!challengeInfo[challenge.id]) {
    return null;
  }

  const reviewRow = (
    <>
      <Td>
        <Link as={RouteLink} to={`/builders/${challenge.userAddress}`} pos="relative">
          <Address address={challenge.userAddress} w="12.5" fontSize="16" />
        </Link>
      </Td>
      <Td>
        <Link as={RouteLink} to={`/challenge/${challenge.id}`}>
          {challengeInfo[challenge.id].label}
        </Link>
      </Td>
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
                <Th>Challenge</Th>
                <Th>Contract</Th>
                <Th>Live demo</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>{reviewRow}</Tr>
            </Tbody>
          </Table>
          <ModalBody px={6} pb={0}>
            <Textarea
              onChange={e => {
                const value = e.target.value;
                setComment(value);
              }}
              placeholder="Comment"
              style={{ marginBottom: 10 }}
              rows={10}
            />
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
