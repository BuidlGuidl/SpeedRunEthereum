import React, { useEffect, useState, useContext } from "react";
import { Button, Container, Heading } from "@chakra-ui/react";
import SignatureSignUp from "../components/SignatureSignUp";
import { getAllEvents } from "../data/api";
import { eventToString } from "../helpers/events";
import { FlashMessagesContext } from "../App";

export default function HomeView({ serverUrl, address, userProvider }) {
  const [eventsFeed, setEventFeeds] = useState([]);
  const { flashMessage } = useContext(FlashMessagesContext);

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
      <Button onClick={() => flashMessage.success("Success message")}>Success Flash</Button>
      <Button onClick={() => flashMessage.error("An error message")} ml={4}>Error Flash</Button>
      <SignatureSignUp serverUrl={serverUrl} address={address} userProvider={userProvider} />
      <h3>Activity feed</h3>
      {eventsFeed.map(event => (
        <div>{eventToString(event)}</div>
      ))}
    </Container>
  );
}
