import React from "react";
import { useHistory } from "react-router-dom";
import ChallengeList from "../components/ChallengeList";

export default function ProfileView({ userObject, userName }) {
  const history = useHistory();
  if (userObject == null || Object.keys(userObject).length === 0) {
    history.push("/");
  }

  return (
    <div>
      <h1>Welcome {userName}!</h1>
      <div style={{ textAlign: "start" }}>
        <ChallengeList userChallenges={userObject.challenges} />
      </div>
    </div>
  );
}
