import React, { useEffect, useState } from "react";
import axios from "axios";
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
    <div className="container">
      <h1>scaffold-eth Builders</h1>
      <ul>
        {builders.map(builder => (
          <li>
            <BuilderCard builder={builder} mainnetProvider={mainnetProvider} />
          </li>
        ))}
      </ul>
    </div>
  );
}
