import React, { useEffect, useState } from "react";
import { Typography } from "antd";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

export default function BuilderProfileView({ serverUrl }) {
  const { builderAddress } = useParams();

  const [builder, setBuilder] = useState();

  useEffect(() => {
    async function fetchBuilder() {
      const fetchedBuilder = await axios.get(serverUrl + `builders/${builderAddress}`);
      setBuilder(fetchedBuilder.data);
    }
    fetchBuilder();
  }, [builderAddress]);

  return (
    <div className="container">
      <Link to="/builders">{"<"}Back to list of builders</Link>
      <Title>scaffold-eth Builder Profile</Title>
      <pre>{JSON.stringify(builder, null, 2)}</pre>
    </div>
  );
}
