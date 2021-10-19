import React, { useEffect, useState } from "react";
import { Link as RouteLink, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
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
  Container,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import BuilderProfileCard from "../components/BuilderProfileCard";
import { challengeInfo } from "../data/challenges";
import ChallengeStatusTag from "../components/ChallengeStatusTag";
import { getAcceptedChallenges } from "../helpers/builders";

// TODO get the real level of challenge
// TODO get the real number of attempts using the events
// TODO get the real date of submission using the events
  export default function BuilderProfileView({ serverUrl, mainnetProvider, address }) {
  const { builderAddress } = useParams();

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
            <Flex borderRadius="lg" borderColor="gray.200" borderWidth={1} p={4} w="full" justify="space-between">
              <Flex bg="gray.50" borderRadius="lg" w={12} h={12} justify="center" align="center">
                <InfoOutlineIcon w={5} h={5} />
              </Flex>
              <div>
                <Text fontSize="xl" fontWeight="medium" textAlign="right">
                  {acceptedChallenges.length}
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="right">
                  challenges completed
                </Text>
              </div>
            </Flex>
            <Flex borderRadius="lg" borderColor="gray.200" borderWidth={1} p={4} w="full" justify="space-between">
              <Flex bg="gray.50" borderRadius="lg" w={12} h={12} justify="center" align="center">
                <InfoOutlineIcon w={5} h={5} />
              </Flex>
              <div>
                <Text fontSize="xl" fontWeight="medium" textAlign="right">
                  --
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="right">
                  Success rate
                </Text>
              </div>
            </Flex>
            <Flex borderRadius="lg" borderColor="gray.200" borderWidth={1} p={4} w="full" justify="space-between">
              <Flex bg="gray.50" borderRadius="lg" w={12} h={12} justify="center" align="center">
                <InfoOutlineIcon w={5} h={5} />
              </Flex>
              <div>
                <Text fontSize="xl" fontWeight="medium" textAlign="right">
                  --
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="right">
                  Builder role
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
              <Thead>
                <Tr>
                  <Th w="full">Name</Th>
                  <Th isNumeric>Level</Th>
                  <Th isNumeric>Attempts</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {challenges.map(([challengeId, lastSubmission]) => (
                  <Tr>
                    <Td w="full">
                      <Link as={RouteLink} to={`/challenge/${challengeId}`} fontWeight="700">
                        {challengeInfo[challengeId].label}
                      </Link>
                    </Td>
                    <Td isNumeric>2</Td>
                    <Td isNumeric>4</Td>
                    <Td>
                      <ChallengeStatusTag status={lastSubmission.status} />
                    </Td>
                    <Td whiteSpace="nowrap">2021 Aug 20</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Flex
              justify="center"
              align="center"
              borderRadius="lg"
              borderColor="gray.200"
              borderWidth={1}
              py={36}
              w="full"
            >
              {isMyProfile ? (
                <Box maxW="xs" textAlign="center">
                  <Text fontWeight="medium" color="gray.700" mb={2}>
                    Start a new challenge
                  </Text>
                  <Text color="gray.500" mb={4}>
                    Show off your skills. Learn everything you need to build on Ethereum!
                  </Text>
                  <Button colorScheme="blue">Start a challenge</Button>
                </Box>
              ) : (
                <Box maxW="xs" textAlign="center">
                  <Text color="gray.500" mb={4}>
                    This builder hasn't completed any challenges.
                  </Text>
                </Box>
              )}
            </Flex>
          )}
        </GridItem>
      </SimpleGrid>
    </Container>
  );
}
