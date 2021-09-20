import React, { useEffect, useState } from "react";
import { Typography, Spin } from "antd";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ChallengeList from "../components/ChallengeList";
import Address from "../components/Address";

const { Title } = Typography;

export default function BuilderProfileView({ serverUrl, mainnetProvider }) {
  const { builderAddress } = useParams();

  const [builder, setBuilder] = useState();

  useEffect(() => {
    async function fetchBuilder() {
      const fetchedBuilder = await axios.get(serverUrl + `builders/${builderAddress}`);
      setBuilder(fetchedBuilder.data);
      console.log(fetchedBuilder.data);
    }
    fetchBuilder();
  }, [builderAddress]);

  return (
    <div className="container">
      <Link to="/builders">{"<"}Back to list of builders</Link>
      <Title>Builder Progress</Title>
      {builder ? (
        <>
          <Address address={builder.id} ensProvider={mainnetProvider} />
          <div style={{ textAlign: "start" }}>
            <ChallengeList userChallenges={builder.challenges} />
          </div>
        </>
      ) : (
        <Spin />
      )}
    </div>
  );
}
