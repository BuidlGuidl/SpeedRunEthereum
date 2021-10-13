import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Heading } from "@chakra-ui/react";
import BuilderCard from "../components/BuilderCard";

const serverPath = "/builders";

export default function BuilderListView({ serverUrl, mainnetProvider }) {
  const [builders, setBuilders] = useState([]);

  useEffect(() => {
    async function fetchBuilders() {
      const fetchedBuilders = await axios.get(serverUrl + serverPath);
      setBuilders(fetchedBuilders.data);
    }

    fetchBuilders();
  }, [serverUrl]);

  return (
    <Container>
      <Heading as="h1">scaffold-eth Builders</Heading>
      <ul style={{ listStyle: "none" }}>
        {builders.map(builder => (
          <li key={builder.id}>
            <BuilderCard builder={builder} mainnetProvider={mainnetProvider} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
