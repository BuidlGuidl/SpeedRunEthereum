import React, { useEffect, useState } from "react";
import { Link as RouteLink, useParams } from "react-router-dom";
import axios from "axios";
import { Box, HStack, Text, Flex, Container, SimpleGrid, GridItem } from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import ChallengeList from "../components/ChallengeList";
import Address from "../components/Address";
import BuilderProfileCard from "../components/BuilderProfileCard";

export default function BuilderProfileView({ serverUrl, mainnetProvider }) {
  const { builderAddress } = useParams();

  const [builder, setBuilder] = useState();

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
          <HStack spacing={4}>
            <Flex borderRadius="lg" borderColor="gray.200" borderWidth={1} p={4} w="full" justify="space-between">
              <Flex bg="gray.50" borderRadius="lg" w={12} h={12} justify="center" align="center">
                <InfoOutlineIcon w={5} h={5} />
              </Flex>
              <div>
                <Text fontSize="xl" fontWeight="medium" textAlign="right">
                  4
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
                  95%
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
                  Beginner
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="right">
                  Builder role
                </Text>
              </div>
            </Flex>
          </HStack>
        </GridItem>
      </SimpleGrid>
    </Container>
  );
}
