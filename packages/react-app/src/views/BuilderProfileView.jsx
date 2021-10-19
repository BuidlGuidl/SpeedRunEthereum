import React, { useEffect, useState } from "react";
import { Link as RouteLink, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Container, Heading, Link } from "@chakra-ui/react";
import ChallengeList from "../components/ChallengeList";
import Address from "../components/Address";

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
    <Container>
      <Link as={RouteLink} to="/builders">
        {"<"}Back to list of builders
      </Link>
      <Heading as="h1">Builder Progress</Heading>
      {builder ? (
        <Box pos="relative">
          <Address address={builder.id} ensProvider={mainnetProvider} w="12.5" />
          <div style={{ textAlign: "start" }}>
            <ChallengeList userChallenges={builder.challenges ?? []} />
          </div>
        </Box>
      ) : (
        "Loading..."
      )}
    </Container>
  );
}
