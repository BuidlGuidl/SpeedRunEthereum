import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  SkeletonText,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Flex,
  Select,
  Center,
} from "@chakra-ui/react";
import useCustomColorModes from "../hooks/useCustomColorModes";
import { getAllEvents } from "../data/api";
import EventRow from "../components/EventRow";
import { EVENT_TYPES } from "../helpers/events";

const countEventValues = [25, 50, 100];

export default function ActivityView() {
  const [eventsFeed, setEventFeeds] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [eventCount, setEventCount] = useState(25);
  const [eventTypeFilter, setEventTypeFilter] = useState("");

  const { secondaryFontColor } = useCustomColorModes();

  useEffect(() => {
    const updateEvents = async () => {
      setIsLoadingEvents(true);
      const events = await getAllEvents(eventTypeFilter, eventCount);
      setEventFeeds(events);
      setIsLoadingEvents(false);
    };

    updateEvents();
  }, [eventTypeFilter, eventCount]);

  const handleFilterChange = e => {
    const filter = e.target.value;
    setEventTypeFilter(filter);
  };

  return (
    <Container maxW="container.md" centerContent>
      <Heading as="h1" mb="4">
        Activity feed
      </Heading>
      <Text color={secondaryFontColor} textAlign="center" mb={10}>
        Last 25 things happening at SRE.
      </Text>
      {isLoadingEvents ? (
        <Box w="100%" maxW="500px">
          <SkeletonText mt="4" noOfLines={10} spacing="4" />
        </Box>
      ) : (
        <>
          <Flex mb={4} justify="right">
            <Select placeholder="- All -" onChange={handleFilterChange} value={eventTypeFilter}>
              {Object.entries(EVENT_TYPES).map(([id, value]) => (
                <option value={value} key={value}>
                  {id}
                </option>
              ))}
            </Select>
          </Flex>
          <Table>
            <Thead>
              <Tr>
                <Th>Builder</Th>
                <Th>Time</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {eventsFeed.map(event => (
                <EventRow key={`${event.timestamp}_${event.payload.userAddress}`} event={event} />
              ))}
            </Tbody>
          </Table>
          <Center mt={4} mb="50">
            <Box>
              <Select
                isFullWidth={false}
                value={eventCount}
                onChange={e => {
                  const count = Number(e.target.value);
                  setEventCount(count);
                }}
              >
                {countEventValues.map(countOption => (
                  <option key={countOption} value={countOption}>
                    Show {countOption}
                  </option>
                ))}
              </Select>
            </Box>
          </Center>
        </>
      )}
    </Container>
  );
}
