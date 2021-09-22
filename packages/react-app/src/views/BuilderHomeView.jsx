import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChallengeList from "../components/ChallengeList";

export default function BuilderHomeView({ serverUrl, token, address }) {
  const [user, setUser] = useState();

  const history = useHistory();
  if (token == null) {
    history.push("/");
  }

  useEffect(() => {
    async function fetchUserData() {
      console.log("getting user data");
      const fetchedUserObject = await axios.get(serverUrl + `user`, {
        headers: {
          authorization: `token ${token}`,
          address,
        },
      });
      setUser(fetchedUserObject.data);
      console.log(fetchedUserObject.data);
    }
    fetchUserData();
  }, [address]);

  return (
    <div className="container">
      <h1>Welcome {address}!</h1>
      {user ? (
        <div style={{ textAlign: "start" }}>
          <ChallengeList userChallenges={user.challenges} />
        </div>
      ) : null}
    </div>
  );
}
