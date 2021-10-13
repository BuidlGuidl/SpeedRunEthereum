import React, { useEffect, useState } from "react";
import { Container, Heading } from "@chakra-ui/react";
import SignatureSignUp from "../components/SignatureSignUp";
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
    <Container>
      <Heading as="h1">Welcome to scaffold-directory!</Heading>
      <p>Sign, build and show!</p>
      <SignatureSignUp serverUrl={serverUrl} address={address} userProvider={userProvider} />
      <h3>Activity feed</h3>
      {eventsFeed.map(event => (
        <div>{eventToString(event)}</div>
      ))}
    </Container>
  );
}
