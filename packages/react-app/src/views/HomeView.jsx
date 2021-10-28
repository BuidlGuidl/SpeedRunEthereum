import React, { useEffect, useState } from "react";
import { Container, SimpleGrid, Heading, Text } from "@chakra-ui/react";
import BuildCard from "../components/BuildCard";
import { getAllEvents, getAllBuilds } from "../data/api";
import { eventToString } from "../helpers/events";

export default function HomeView() {
  const [eventsFeed, setEventFeeds] = useState([]);
  const [builds, setBuilds] = useState([]);
  useEffect(() => {
    const updateEvents = async () => {
      const events = await getAllEvents();
      setEventFeeds(events.reverse());
    };

    const updateBuilds = async () => {
      const allBuilds = await getAllBuilds();
      setBuilds(allBuilds);
    };

    updateEvents();
    updateBuilds();
  }, []);

  return (
    <Container maxW="container.xl" centerContent>
      <Container maxW="container.md">
        <Text color="gray.700" mb="12" fontSize="xl" textAlign="center">
          The{" "}
          <span role="img" aria-label="castle icon">
            🏰
          </span>{" "}
          BuidlGuidl is a curated group of Ethereum builders creating products, prototypes, and tutorials with{" "}
          <span role="img" aria-label="crane icon">
            🏗
          </span>
          scaffold-eth
        </Text>
      </Container>
      <Heading as="h2">All builds</Heading>
      <Text color="gray.700" mb="6">
        Explore all our Ethereum web3 projects.
      </Text>
      <SimpleGrid columns={[1, null, 2, null, 3]} spacing={6} pb={20}>
        {builds.map(build => (
          <BuildCard build={build} key={build.name}/>
        ))}
      </SimpleGrid>
    </Container>
  );
}
