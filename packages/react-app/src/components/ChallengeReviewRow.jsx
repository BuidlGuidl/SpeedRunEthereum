import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { Button, HStack, Link, Td, Tr, Textarea } from "@chakra-ui/react";
import { challengeInfo } from "../data/challenges";
import Address from "./Address";

export default function ChallengeReviewRow({ challenge, isLoading, approveClick, rejectClick }) {
  const [comment, setComment] = React.useState("");

  if (!challengeInfo[challenge.id]) {
    return null;
  }

  return (
    <Tr>
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
        <Link href={challenge.branchUrl} color="teal.500" target="_blank" rel="noopener noreferrer">
          Code
        </Link>
      </Td>
      <Td>
        <Link href={challenge.deployedUrl} color="teal.500" target="_blank" rel="noopener noreferrer">
          Demo
        </Link>
      </Td>
      <Td>
        <Textarea
          onChange={e => {
            const value = e.target.value;
            setComment(value);
          }}
          placeholder="Comment"
          style={{ marginBottom: 10 }}
          rows={2}
        />
      </Td>
      <Td>
        <HStack spacing={3}>
          <Button
            type="button"
            colorScheme="red"
            disabled={isLoading}
            className="danger"
            onClick={() => rejectClick(challenge.userAddress, challenge.id, comment)}
            size="xs"
          >
            Reject
          </Button>
          <Button
            type="button"
            colorScheme="green"
            disabled={isLoading}
            style={{ marginRight: 10 }}
            onClick={() => approveClick(challenge.userAddress, challenge.id, comment)}
            size="xs"
          >
            Approve
          </Button>
        </HStack>
      </Td>
    </Tr>
  );
}
