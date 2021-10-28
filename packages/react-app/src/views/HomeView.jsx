import React, { useEffect, useState } from "react";
import { Container, Heading, Text } from "@chakra-ui/react";
import { getAllEvents, getAllBuilds } from "../data/api";
import { eventToString } from "../helpers/events";

export default function HomeView({ serverUrl, address, userProvider }) {
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
    <Container maxW="container.lg" centerContent>
      <Container maxW="container.md">
        <Text color="gray.700" mb="8" fontSize="xl" textAlign="center">
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
      {builds.map(build => (
        <Text fontSize="sm" color="gray.600">
          {build.name}
        </Text>
      ))}
      <Heading as="h3" size="md" mb="2">
        Activity feed
      </Heading>
      {eventsFeed.map(event => (
        <Text fontSize="sm" color="gray.600">
          {eventToString(event)}
        </Text>
      ))}
    </Container>
  );
}
