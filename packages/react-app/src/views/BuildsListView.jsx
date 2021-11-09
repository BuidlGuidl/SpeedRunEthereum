import React, { useEffect, useState } from "react";
import { Container, SimpleGrid, Heading, Text } from "@chakra-ui/react";
import BuildCard from "../components/BuildCard";
import { getAllBuilds } from "../data/api";

export default function BuildsListView() {
  const [builds, setBuilds] = useState([]);
  useEffect(() => {
    const updateBuilds = async () => {
      const allBuilds = await getAllBuilds();
      setBuilds(allBuilds);
    };

    updateBuilds();
  }, []);

  return (
    <Container maxW="container.xl" centerContent>
      <Heading as="h2">All builds</Heading>
      <Text color="gray.700" mb="6">
        Explore all our Ethereum web3 projects.
      </Text>
      <SimpleGrid columns={[1, null, 2, null, 3]} spacing={6} pb={20}>
        {builds.map(build => (
          <BuildCard build={build} key={build.name} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
