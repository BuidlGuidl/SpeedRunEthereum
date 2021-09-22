import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChallengeList from "../components/ChallengeList";

export default function BuilderHomeView({ serverUrl, jwt, address }) {
  const [userData, setUserData] = useState();

  const history = useHistory();
  if (jwt == null || jwt === "") {
    history.push("/");
  }

  useEffect(() => {
    async function fetchUserData() {
      console.log("getting user data");
      const fetchedUserObject = await axios.get(serverUrl + `user`, {
        headers: {
          authorization: `token ${jwt}`,
          address,
        },
      });
      setUserData(fetchedUserObject.data);
      console.log(fetchedUserObject.data);
    }
    if (jwt != null && jwt !== "") {
      fetchUserData();
    }
  }, [jwt, address]);

  return (
    <div className="container">
      <h1>Welcome {address}!</h1>
      {userData ? (
        <div style={{ textAlign: "start" }}>
          <ChallengeList userChallenges={userData.challenges} />
        </div>
      ) : null}
    </div>
  );
}
