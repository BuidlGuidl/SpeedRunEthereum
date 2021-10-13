import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Container, Heading } from "@chakra-ui/react";
import ChallengeList from "../components/ChallengeList";

export default function BuilderHomeView({ serverUrl, address }) {
  const [userData, setUserData] = useState();

  const history = useHistory();
  if (!address) {
    history.push("/");
  }

  useEffect(() => {
    async function fetchUserData() {
      console.log("getting user data");
      const fetchedUserObject = await axios.get(serverUrl + `/user`, {
        params: { address },
      });
      setUserData(fetchedUserObject.data);
      console.log(fetchedUserObject.data);
    }

    if (address) {
      fetchUserData();
    }
  }, [address, serverUrl]);

  return (
    <Container>
      <Heading as="h1">Welcome {address}!</Heading>
      {userData ? (
        <div style={{ textAlign: "start" }}>
          <ChallengeList userChallenges={userData.challenges ?? []} />
        </div>
      ) : null}
    </Container>
  );
}
