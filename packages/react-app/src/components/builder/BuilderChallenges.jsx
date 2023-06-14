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
import { FormattedMessage, useIntl } from "react-intl";
import BuilderProfileChallengesTableSkeleton from "../skeletons/BuilderProfileChallengesTableSkeleton";
import { getChallengeInfo } from "../../data/challenges";
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
  const { primaryFontColor, secondaryFontColor, borderColor, linkColor } = useCustomColorModes();
  const intl = useIntl();
  const challengeInfo = getChallengeInfo(intl);

  return (
    <>
      <Flex mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          <FormattedMessage id="builderChallenges.challenges" defaultMessage="Challenges" />
        </Text>
        <Spacer />
      </Flex>
      {isLoadingBuilder && <BuilderProfileChallengesTableSkeleton />}
      {!isLoadingBuilder &&
        (challenges ? (
          <Box overflowX="auto">
            <Table colorScheme="green">
              {isMyProfile && (
                <TableCaption>
                  <Button as={RouteLink} colorScheme="green" to="/">
                    <FormattedMessage id="builderChallenges.start-challenge" defaultMessage="Start a challenge" />
                  </Button>
                </TableCaption>
              )}
              <Thead>
                <Tr>
                  <Th>
                    <FormattedMessage id="builderChallenges.table.name" defaultMessage="Name" />
                  </Th>
                  <Th>
                    <FormattedMessage id="builderChallenges.table.contract" defaultMessage="Contract" />
                  </Th>
                  <Th>
                    <FormattedMessage id="builderChallenges.table.live-demo" defaultMessage="Live Demo" />
                  </Th>
                  <Th>
                    <FormattedMessage id="builderChallenges.table.updated" defaultMessage="Updated" />
                  </Th>
                  <Th>
                    <FormattedMessage id="builderChallenges.table.status" defaultMessage="Status" />
                  </Th>
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
                        <Link as={RouteLink} to={`/challenge/${challengeId}`} fontWeight="bold" color={linkColor}>
                          {challengeInfo[challengeId].label}
                        </Link>
                      </Td>
                      <Td>
                        <Link
                          // Legacy branchUrl
                          href={lastSubmission.contractUrl || lastSubmission.branchUrl}
                          color={linkColor}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FormattedMessage id="general.code" defaultMessage="Code" />
                        </Link>
                      </Td>
                      <Td>
                        <Link
                          href={lastSubmission.deployedUrl}
                          color={linkColor}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FormattedMessage id="general.demo" defaultMessage="Demo" />
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
                  <FormattedMessage id="builderChallenges.empty-state.title" defaultMessage="Start a new challenge" />
                </Text>
                <Text color={secondaryFontColor} mb={4}>
                  <FormattedMessage
                    id="builderChallenges.empty-state.description"
                    defaultMessage="Show off your skills. Learn everything you need to build on Ethereum!"
                  />
                </Text>
                <Button as={RouteLink} colorScheme="green" to="/">
                  <FormattedMessage id="builderChallenges.empty-state.button" defaultMessage="Start a challenge" />
                </Button>
              </Box>
            ) : (
              <Box maxW="xs" textAlign="center">
                <Text color={secondaryFontColor} mb={4}>
                  <FormattedMessage
                    id="builderChallenges.empty-state.other-profile"
                    defaultMessage="This builder hasn't completed any challenges."
                  />
                </Text>
              </Box>
            )}
          </Flex>
        ))}
    </>
  );
};
