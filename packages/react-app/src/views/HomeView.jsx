import React, { useEffect, useState } from "react";
import { chakra, Flex, Container, Heading } from "@chakra-ui/react";
import SignatureSignUp from "../components/SignatureSignUp";
import { getAllEvents } from "../data/api";
import { eventToString } from "../helpers/events";
import QRPunkBlockie from "../components/QrPunkBlockie";
import QRPunkBlockiePro from "../components/QrPunkBlockieClean";

const ChakraBlockie = chakra(QRPunkBlockie);
const ChakraBlockiePro = chakra(QRPunkBlockiePro);

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
      <Flex>
        old
        <QRPunkBlockie withQr={false} address={address.toLowerCase()} scale={0.4} />
        new
        <QRPunkBlockiePro withQr={false} address={address.toLowerCase()} scale={0.4} />
        new
        <ChakraBlockiePro withQr={false} address={address.toLowerCase()} scale={0.4} borderRadius={8} />
        old
        <ChakraBlockie withQr={false} address={address.toLowerCase()} scale={0.4} borderRadius={8} />
      </Flex>
      <h3>Activity feed</h3>
      {eventsFeed.map(event => (
        <div>{eventToString(event)}</div>
      ))}
    </Container>
  );
}
