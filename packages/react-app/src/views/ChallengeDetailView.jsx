import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { challengeInfo } from "../data/challenges";
import ChallengeSubmission from "../components/ChallengeSubmission";

export default function ChallengeDetailView({ serverUrl, address, userProvider }) {
  const { challengeId } = useParams();
  const history = useHistory();

  const challenge = challengeInfo[challengeId];
  if (!challenge) {
    // TODO implement a 404 page
    // this looks good: https://ant.design/components/result/#components-result-demo-404
    history.push("/404");
  }

  return (
    <div className="container">
      <h1>{challenge.label}</h1>
      <p>{challenge.description}</p>
      <a href={challenge.url} target="_blank" rel="noreferrer">
        Link to challenge
      </a>
      <ChallengeSubmission challenge={challenge} serverUrl={serverUrl} address={address} userProvider={userProvider} />
    </div>
  );
}
