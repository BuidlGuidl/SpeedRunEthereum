import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Heading, Link, Text, Table, Thead, Tbody, Tr, Th } from "@chakra-ui/react";
import BuilderRow from "../components/BuilderRow";

const serverPath = "/builders";

export default function BuilderListView({ serverUrl, mainnetProvider }) {
  const [builders, setBuilders] = useState([]);

  useEffect(() => {
    async function fetchBuilders() {
      const fetchedBuilders = await axios.get(serverUrl + serverPath);
      setBuilders(fetchedBuilders.data);
    }

    fetchBuilders();
  }, [serverUrl]);

  return (
    <Container maxW="container.lg">
      <Container maxW="container.md" centerContent>
        <Heading as="h1" mb="2">
          All Builders
        </Heading>
        <Text color="gray.700" textAlign="center">
          List of Ethereum builders creating products, prototypes, and tutorials with{" "}
          <Link href="https://github.com/scaffold-eth/scaffold-eth" color="teal.500" isExternal>
            scaffold-eth
          </Link>
          .
        </Text>
        <Text color="gray.700" mb="6">You can fund Eth development sending Eth to any stream.</Text>
      </Container>
      <Table>
        <Thead>
          <Tr>
            <Th>Builder</Th>
            <Th>Challenges</Th>
          </Tr>
        </Thead>
        <Tbody>
          {builders.map(builder => (
            <BuilderRow builder={builder} mainnetProvider={mainnetProvider} />
          ))}
        </Tbody>
      </Table>
    </Container>
  );
}
