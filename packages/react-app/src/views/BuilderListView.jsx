import React, { useEffect, useState } from "react";
import { List, Typography } from "antd";
import axios from "axios";
import BuilderCard from "../components/BuilderCard";

const { Title } = Typography;
const serverPath = "builders";

export default function BuilderListView({ serverUrl, mainnetProvider }) {
  const [builders, setBuilders] = useState([]);

  useEffect(() => {
    async function fetchBuilders() {
      const fetchedBuilders = await axios.get(serverUrl + serverPath);
      setBuilders(fetchedBuilders.data);
    }

    fetchBuilders();
  }, []);

  return (
    <div className="container">
      <Title>scaffold-eth Builders</Title>
      <List
        bordered
        dataSource={builders}
        renderItem={builder => (
          <List.Item>
            <BuilderCard builder={builder} mainnetProvider={mainnetProvider} />
          </List.Item>
        )}
      />
    </div>
  );
}
