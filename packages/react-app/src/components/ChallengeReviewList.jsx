import React from "react";
import { chakra, Button, HStack, Link, VStack, Textarea } from "@chakra-ui/react";
import { challengeInfo } from "../data/challenges";

export default function ChallengeReviewList({ challengeSubmissions, isLoading, approveClick, rejectClick }) {
  const [commentMap, setCommentMap] = React.useState({});

  return (
    <VStack as="ul" spacing={6}>
      {challengeSubmissions.map(challenge => (
        <chakra.li key={challenge.userAddress + challenge.id} w="100%">
          <div>
            <strong>{challengeInfo[challenge.id].label}</strong>
            <p>{challengeInfo[challenge.id].description}</p>
          </div>
          <HStack spacing={3}>
            <Link href={challenge.branchUrl} color="teal.500" target="_blank" rel="noopener noreferrer">
              Code
            </Link>
            <Link href={challenge.deployedUrl} color="teal.500" target="_blank" rel="noopener noreferrer">
              Live Demo
            </Link>
          </HStack>
          <div>
            <Textarea
              onChange={e => {
                const value = e.target.value;
                setCommentMap(preCommentMap => {
                  const currentCommentMap = { ...preCommentMap };
                  currentCommentMap[challenge.userAddress + challenge.id] = value;
                  return currentCommentMap;
                });
              }}
              placeholder="Comment for builder"
              style={{ marginBottom: 10 }}
              rows={2}
            />
            <HStack spacing="12px">
              <Button
                type="button"
                colorScheme="red"
                disabled={isLoading}
                className="danger"
                onClick={() =>
                  rejectClick(challenge.userAddress, challenge.id, commentMap[challenge.userAddress + challenge.id])
                }
              >
                Reject
              </Button>
              <Button
                type="button"
                colorScheme="blue"
                disabled={isLoading}
                style={{ marginRight: 10 }}
                onClick={() =>
                  approveClick(challenge.userAddress, challenge.id, commentMap[challenge.userAddress + challenge.id])
                }
              >
                Approve Button
              </Button>
            </HStack>
          </div>
        </chakra.li>
      ))}
    </VStack>
  );
}
