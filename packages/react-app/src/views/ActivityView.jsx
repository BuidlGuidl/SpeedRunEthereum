import React, { useEffect, useState } from "react";
import { Box, Container, Heading, SkeletonText, Text } from "@chakra-ui/react";
import useCustomColorModes from "../hooks/useCustomColorModes";
import { getAllEvents } from "../data/api";
import { eventToString } from "../helpers/events";

export default function ActivityView() {
  const [eventsFeed, setEventFeeds] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const { secondaryFontColor } = useCustomColorModes();

  useEffect(() => {
    const updateEvents = async () => {
      setIsLoadingEvents(true);
      const events = await getAllEvents();
      setEventFeeds(events.reverse());
      setIsLoadingEvents(false);
    };

    updateEvents();
  }, []);

  return (
    <Container maxW="container.md" centerContent>
      <Heading as="h1" mb="4">
        Activity feed
      </Heading>
      <Text color={secondaryFontColor} textAlign="center" mb={10}>
        Last 15 things happening at SRE.
      </Text>
      {isLoadingEvents ? (
        <Box w="100%" maxW="500px">
          <SkeletonText mt="4" noOfLines={10} spacing="4" />
        </Box>
      ) : (
        eventsFeed.map(event => <Box>{eventToString(event)}</Box>)
      )}
    </Container>
  );
}
