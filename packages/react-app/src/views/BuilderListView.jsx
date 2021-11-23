import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Container, Heading, Link, Text, Table, Thead, Tbody, Tr, Th } from "@chakra-ui/react";
import BuilderRow from "../components/BuilderRow";
import useCustomColorModes from "../hooks/useCustomColorModes";

const serverPath = "/builders";

export default function BuilderListView({ serverUrl, mainnetProvider }) {
  const [builders, setBuilders] = useState([]);
  const { secondaryFontColor } = useCustomColorModes();

  useEffect(() => {
    async function fetchBuilders() {
      const fetchedBuilders = await axios.get(serverUrl + serverPath);
      setBuilders(fetchedBuilders.data);
    }

    fetchBuilders();
  }, [serverUrl]);

  return (
    <Container maxW="container.xl">
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
      <Box overflowX="auto">
        <Table>
          <Thead>
            <Tr color={secondaryFontColor}>
              <Th>Builder</Th>
              <Th isNumeric>Builds</Th>
              <Th isNumeric>Challenges</Th>
              <Th isNumeric>Stream</Th>
              <Th isNumeric>Allowance</Th>
              <Th isNumeric>Available</Th>
              <Th textAlign="center">Role</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {builders.map(builder => (
              <BuilderRow key={builder.id} builder={builder} mainnetProvider={mainnetProvider} />
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
}
