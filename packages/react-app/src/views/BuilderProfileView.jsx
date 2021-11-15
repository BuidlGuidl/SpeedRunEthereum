import React, { useEffect, useState } from "react";
import { Link as RouteLink, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Link,
  HStack,
  Text,
  Flex,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Container,
  SimpleGrid,
  GridItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tag,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import BuilderProfileCard from "../components/BuilderProfileCard";
import { challengeInfo } from "../data/challenges";
import { CHALLENGE_SUBMISSION_STATUS, userFunctionDescription } from "../helpers/constants";
import ChallengeStatusTag from "../components/ChallengeStatusTag";
import { getAcceptedChallenges } from "../helpers/builders";
import ChallengeList from "../components/ChallengeList";
import useCustomColorModes from "../hooks/useCustomColorModes";

// TODO get the real date of submission using the events
export default function BuilderProfileView({ serverUrl, mainnetProvider, address }) {
  const { builderAddress } = useParams();
  const { primaryFontColor, secondaryFontColor, borderColor } = useCustomColorModes();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [builder, setBuilder] = useState();
  const challenges = builder?.challenges ? Object.entries(builder.challenges) : undefined;
  const acceptedChallenges = getAcceptedChallenges(builder?.challenges);
  const isMyProfile = builderAddress === address;

  useEffect(() => {
    async function fetchBuilder() {
      const fetchedBuilder = await axios.get(serverUrl + `/builders/${builderAddress}`);
      setBuilder(fetchedBuilder.data);
      console.log(fetchedBuilder.data);
    }
    fetchBuilder();
  }, [builderAddress, serverUrl]);

  return (
    <Container maxW="container.xl">
      <SimpleGrid gap={14} columns={4}>
        <GridItem colSpan={1}>
          <BuilderProfileCard builder={builder} mainnetProvider={mainnetProvider} />
        </GridItem>
        <GridItem colSpan={3}>
          <HStack spacing={4} mb={8}>
            <Flex borderRadius="lg" borderColor={borderColor} borderWidth={1} p={4} w="full" justify="space-between">
              <Flex bg="gray.50" borderRadius="lg" w={12} h={12} justify="center" align="center">
                <InfoOutlineIcon w={5} h={5} />
              </Flex>
              <div>
                <Text fontSize="xl" fontWeight="medium" textAlign="right">
                  {acceptedChallenges.length}
                </Text>
                <Text fontSize="sm" color={secondaryFontColor} textAlign="right">
                  challenges completed
                </Text>
              </div>
            </Flex>
            <Flex borderRadius="lg" borderColor={borderColor} borderWidth={1} p={4} w="full" justify="space-between">
              <Flex bg="gray.50" borderRadius="lg" w={12} h={12} justify="center" align="center">
                <InfoOutlineIcon w={5} h={5} />
              </Flex>
              <div>
                <Text fontSize="xl" fontWeight="medium" textAlign="right">
                  {builder?.function ? (
                    <Tag colorScheme={userFunctionDescription[builder?.function].colorScheme} variant="solid">
                      {userFunctionDescription[builder?.function].label}
                    </Tag>
                  ) : (
                    "-"
                  )}
                </Text>
                <Text fontSize="sm" color={secondaryFontColor} textAlign="right">
                  Role
                </Text>
              </div>
            </Flex>
          </HStack>
          <Flex mb={4}>
            <Text fontSize="2xl" fontWeight="bold">
              Challenges
            </Text>
            <Spacer />
          </Flex>
          {challenges ? (
            <Table>
              <TableCaption>
                <Button colorScheme="blue" onClick={onOpen}>
                  Start a challenge
                </Button>
              </TableCaption>
              <Thead>
                <Tr>
                  <Th w="full">Name</Th>
                  <Th>Code</Th>
                  <Th>Live Demo</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {challenges.map(([challengeId, lastSubmission]) => {
                  if (!challengeInfo[challengeId]) {
                    return null;
                  }
                  return (
                    <Tr>
                      <Td w="full">
                        <Link as={RouteLink} to={`/challenge/${challengeId}`} fontWeight="700">
                          {challengeInfo[challengeId].label}
                        </Link>
                      </Td>
                      <Td>
                        {lastSubmission.status === CHALLENGE_SUBMISSION_STATUS.ACCEPTED ? (
                          <Link
                            href={lastSubmission.branchUrl}
                            color="teal.500"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Code
                          </Link>
                        ) : (
                          <Center>-</Center>
                        )}
                      </Td>
                      <Td>
                        {lastSubmission.status === CHALLENGE_SUBMISSION_STATUS.ACCEPTED ? (
                          <Link
                            href={lastSubmission.deployedUrl}
                            color="teal.500"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Demo
                          </Link>
                        ) : (
                          <Center>-</Center>
                        )}
                      </Td>
                      <Td>
                        <ChallengeStatusTag status={lastSubmission.status} />
                      </Td>
                      <Td whiteSpace="nowrap">2021 Aug 20</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
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
                  <Button colorScheme="blue" onClick={onOpen}>
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
          )}
        </GridItem>
      </SimpleGrid>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>List of challenges</ModalHeader>
          <ModalCloseButton />
          <ModalBody px={8} pb={8}>
            <ChallengeList userChallenges={builder?.challenges ?? []} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
