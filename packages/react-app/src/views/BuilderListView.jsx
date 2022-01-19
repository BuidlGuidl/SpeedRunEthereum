import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Center, Container, Heading, Link, Text, Table, Thead, Tbody, Tr, Th, chakra } from "@chakra-ui/react";
import BuilderRow from "../components/BuilderRow";
import useCustomColorModes from "../hooks/useCustomColorModes";
import BuilderListSkeleton from "../components/skeletons/BuilderListSkeleton";

const serverPath = "/builders";

export default function BuilderListView({ serverUrl, mainnetProvider }) {
  const [builders, setBuilders] = useState([]);
  const [isLoadingBuilders, setIsLoadingBuilders] = useState(false);
  const { secondaryFontColor } = useCustomColorModes();

  useEffect(() => {
    async function fetchBuilders() {
      setIsLoadingBuilders(true);
      const fetchedBuilders = await axios.get(serverUrl + serverPath);
      setBuilders(fetchedBuilders.data);
      setIsLoadingBuilders(false);
    }

    fetchBuilders();
  }, [serverUrl]);

  return (
    <Container maxW="container.lg">
      <Container maxW="container.md" centerContent>
        <Heading as="h1" mb="4">
          All Builders
        </Heading>
        <Text color={secondaryFontColor} textAlign="center">
          List of Ethereum builders creating products, prototypes, and tutorials with{" "}
          <Link href="https://github.com/scaffold-eth/scaffold-eth" color="teal.500" isExternal>
            scaffold-eth
          </Link>
          .
        </Text>
        <Text color={secondaryFontColor} mb="10">
          You can fund Eth development sending Eth to any stream.
        </Text>
      </Container>
      {isLoadingBuilders ? (
        <BuilderListSkeleton />
      ) : (
        <Box overflowX="auto">
          <Center mb={5}>
            <chakra.strong mr={2}>Total builders:</chakra.strong> {builders.length}
          </Center>
          <Table>
            <Thead>
              <Tr color={secondaryFontColor}>
                <Th>Builder</Th>
                <Th>Challenges</Th>
              </Tr>
            </Thead>
            <Tbody>
              {builders.map(builder => (
                <BuilderRow key={builder.id} builder={builder} mainnetProvider={mainnetProvider} />
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Container>
  );
}
