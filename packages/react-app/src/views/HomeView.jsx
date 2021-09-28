import React from "react";
import { Typography, Space } from "antd";
import SignatureSignUp from "../components/SignatureSignUp";

const { Text, Title } = Typography;

export default function HomeView({ serverUrl, address, userProvider }) {
  return (
    <div className="container">
      <Space direction="vertical">
        <Title>Welcome to scaffold-directory!</Title>
        <Text>Sign, build and show!</Text>
        <SignatureSignUp
          serverUrl={serverUrl}
          address={address}
          userProvider={userProvider}
        />
        <Title level={3}>Activity feed</Title>
      </Space>
    </div>
  );
}
