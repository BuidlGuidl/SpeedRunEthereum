import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Container, Heading, Link, Text, Table, Thead, Tbody, Tr, Th } from "@chakra-ui/react";
import AdminRow from "../components/AdminRow";
import useCustomColorModes from "../hooks/useCustomColorModes";

const serverPath = "/builders";

export default function AdminListView({ serverUrl, mainnetProvider, readContracts }) {
  const [admins, setAdmins] = useState([]);
  const { secondaryFontColor } = useCustomColorModes();
  const adminRole = "0xdf8b4c520ffe197c5343c6f5aec59570151ef9a492f2c624fd45ddde6135ec42";

  var builders = [];
  var ourAdmins = [];

    const loadAdmins = async (builders) => {
    for (let i = 0; i < builders.length; i += 1) {
        let isAdmin = (await readContracts.BuidlBadges.hasRole(adminRole, `${builders[i].id}`));
        if (isAdmin == true) {
        ourAdmins.push(builders[i])
        //console.log(isAdmin)
        }
        setAdmins(ourAdmins)
    }
}

  useEffect(() => {
    if (readContracts) {
    async function fetchBuilders() {
      const fetchedBuilders = await axios.get(serverUrl + serverPath);
      builders.push(fetchedBuilders.data)
      //const fetchedAdmins = builders.forEach(await readContracts.BuidlBadges.hasRole(adminRole, fetchedBuilders.data.id));
      //setAdmins(fetchedBuilders.data);
      loadAdmins(fetchedBuilders.data);
    }

    fetchBuilders();
    //loadAdmins(fetchedBuilders.data);
    console.log(ourAdmins)
  }}, [readContracts, serverUrl]);

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
            {admins.map(admin => (
              <AdminRow key={admin.id} builder={admin} mainnetProvider={mainnetProvider} />
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
}
