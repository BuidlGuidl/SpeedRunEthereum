import React, { useEffect, useState } from "react";
import { Typography, Space } from "antd";
import SignatureSignUp from "../components/SignatureSignUp";
import { getAllEvents } from "../data/api";
import { eventToString } from "../helpers/events";

const { Text, Title } = Typography;

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
    <div className="container">
      <Space direction="vertical">
        <Title>Welcome to scaffold-directory!</Title>
        <Text>Sign, build and show!</Text>
        <SignatureSignUp serverUrl={serverUrl} address={address} userProvider={userProvider} />
        <Title level={3}>Activity feed</Title>
        {eventsFeed.map(event => (
          <div>{eventToString(event)}</div>
        ))}
      </Space>
    </div>
  );
}
