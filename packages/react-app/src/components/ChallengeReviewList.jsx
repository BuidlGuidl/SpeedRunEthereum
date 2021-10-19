import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { Button, HStack, Link, Td, Tr, Textarea } from "@chakra-ui/react";
import { challengeInfo } from "../data/challenges";
import Address from "./Address";

export default function ChallengeReviewList({ challengeSubmissions, isLoading, approveClick, rejectClick, mainnetProvider }) {
  const [commentMap, setCommentMap] = React.useState({});

  return (
    <>
      {challengeSubmissions.map(challenge => (
        <Tr key={challenge.userAddress + challenge.id}>
          <Td>
            <Link as={RouteLink} to={`/builders/${challenge.userAddress}`} pos="relative">
              <Address address={challenge.userAddress} ensProvider={mainnetProvider} scale="0.4" fontSize="16" />
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
                setCommentMap(preCommentMap => {
                  const currentCommentMap = { ...preCommentMap };
                  currentCommentMap[challenge.userAddress + challenge.id] = value;
                  return currentCommentMap;
                });
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
                onClick={() =>
                  rejectClick(challenge.userAddress, challenge.id, commentMap[challenge.userAddress + challenge.id])
                }
                size="xs"
              >
                Reject
              </Button>
              <Button
                type="button"
                colorScheme="green"
                disabled={isLoading}
                style={{ marginRight: 10 }}
                onClick={() =>
                  approveClick(challenge.userAddress, challenge.id, commentMap[challenge.userAddress + challenge.id])
                }
                size="xs"
              >
                Approve
              </Button>
            </HStack>
          </Td>
        </Tr>
      ))}
    </>
  );
}
