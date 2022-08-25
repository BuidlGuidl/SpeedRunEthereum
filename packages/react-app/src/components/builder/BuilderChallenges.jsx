import React from "react";
import { Link as RouteLink } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Link,
  SkeletonText,
  Spacer,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import BuilderProfileChallengesTableSkeleton from "../skeletons/BuilderProfileChallengesTableSkeleton";
import { challengeInfo } from "../../data/challenges";
import DateWithTooltip from "../DateWithTooltip";
import ChallengeStatusTag from "../ChallengeStatusTag";
import useCustomColorModes from "../../hooks/useCustomColorModes";

export const BuilderChallenges = ({
  challenges,
  challengeEvents,
  isMyProfile,
  isLoadingBuilder,
  isLoadingTimestamps,
}) => {
  const { primaryFontColor, secondaryFontColor, borderColor } = useCustomColorModes();

  return (
    <>
      <Flex mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Challenges
        </Text>
        <Spacer />
      </Flex>
      {isLoadingBuilder && <BuilderProfileChallengesTableSkeleton />}
      {!isLoadingBuilder &&
        (challenges ? (
          <Box overflowX="auto">
            <Table>
              {isMyProfile && (
                <TableCaption>
                  <Button as={RouteLink} colorScheme="blue" to="/">
                    Start a challenge
                  </Button>
                </TableCaption>
              )}
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Contract</Th>
                  <Th>Live Demo</Th>
                  <Th>Updated</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {challenges.map(([challengeId, lastSubmission]) => {
                  if (!challengeInfo[challengeId]) {
                    return null;
                  }
                  const lastEventForChallenge = challengeEvents?.filter(
                    event => event.payload.challengeId === challengeId,
                  )[0];

                  return (
                    <Tr key={challengeId}>
                      <Td>
                        <Link as={RouteLink} to={`/challenge/${challengeId}`} fontWeight="700" color="teal.500">
                          {challengeInfo[challengeId].label}
                        </Link>
                      </Td>
                      <Td>
                        <Link
                          // Legacy branchUrl
                          href={lastSubmission.contractUrl || lastSubmission.branchUrl}
                          color="teal.500"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Code
                        </Link>
                      </Td>
                      <Td>
                        <Link
                          href={lastSubmission.deployedUrl}
                          color="teal.500"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Demo
                        </Link>
                      </Td>
                      <Td>
                        {isLoadingTimestamps ? (
                          <SkeletonText noOfLines={1} />
                        ) : (
                          <DateWithTooltip timestamp={lastEventForChallenge?.timestamp} />
                        )}
                      </Td>
                      <Td>
                        <ChallengeStatusTag
                          status={lastSubmission.status}
                          comment={lastSubmission.reviewComment}
                          autograding={lastSubmission.autograding}
                        />
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Flex
            justify="center"
            align="center"
            borderRadius="lg"
            borderColor={borderColor}
            borderWidth={1}
            py={36}
            w="full"
          >
            {isMyProfile ? (
              <Box maxW="xs" textAlign="center">
                <Text fontWeight="medium" color={primaryFontColor} mb={2}>
                  Start a new challenge
                </Text>
                <Text color={secondaryFontColor} mb={4}>
                  Show off your skills. Learn everything you need to build on Ethereum!
                </Text>
                <Button as={RouteLink} colorScheme="blue" to="/">
                  Start a challenge
                </Button>
              </Box>
            ) : (
              <Box maxW="xs" textAlign="center">
                <Text color={secondaryFontColor} mb={4}>
                  This builder hasn't completed any challenges.
                </Text>
              </Box>
            )}
          </Flex>
        ))}
    </>
  );
};
