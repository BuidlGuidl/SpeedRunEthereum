import React, {useEffect, useState} from "react"
import { Typography } from "antd";
import axios from "axios";
import BuilderCard from "../components/BuilderCard";

const { Title } = Typography;
const serverPath = "builders";

export default function BuilderListView({ serverUrl }) {
  const [builders, setBuilders] = useState([]);

  useEffect(() => {
    async function fetchBuilders() {
      const fetchedBuilders = await axios.get(serverUrl + serverPath);
      setBuilders(fetchedBuilders.data);
    }

    fetchBuilders();
  }, []);

  return (
    <>
      <Title>scaffold-eth Builders</Title>
      <ul>
        {builders.map(builder => {
          return (
            <li key={builder.id} style={{ marginTop: 8 }}>
              <BuilderCard builder={builder} />
            </li>
          );
        })}
      </ul>
    </>
  );
}
