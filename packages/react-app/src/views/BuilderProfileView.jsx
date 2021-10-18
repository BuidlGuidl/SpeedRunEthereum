import React, { useEffect, useState } from "react";
import { Link as RouteLink, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Container, SimpleGrid, GridItem } from "@chakra-ui/react";
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
        <GridItem bgColor="blue.400" colSpan={3}>
          Table
        </GridItem>
      </SimpleGrid>
    </Container>
  );
}
