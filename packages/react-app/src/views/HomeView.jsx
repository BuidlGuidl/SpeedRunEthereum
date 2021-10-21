import React, { useEffect, useState } from "react";
import { Container, Heading, Text } from "@chakra-ui/react";
import { getAllEvents } from "../data/api";
import { eventToString } from "../helpers/events";

export default function HomeView({ serverUrl, address, userProvider }) {
  const [eventsFeed, setEventFeeds] = useState([]);
  useEffect(() => {
    const updateEvents = async () => {
      const events = await getAllEvents();
      setEventFeeds(events.reverse());
    };

    updateEvents();
  }, []);

  return (
    <Container maxW="container.md" centerContent>
      <Heading as="h1">Welcome to Scaffold Directory!</Heading>
      <Text color="gray.700" mb="8">Sign, build and show!</Text>
      <Heading as="h3" size="md"  mb="2">Activity feed</Heading>
      {eventsFeed.map(event => (
        <Text fontSize="sm" color="gray.600">{eventToString(event)}</Text>
      ))}
    </Container>
  );
}
