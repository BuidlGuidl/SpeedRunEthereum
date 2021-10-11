import React from "react";
import { Link } from "react-router-dom";

const ChallengeCard = ({ challengeId, challengeInfo, submissionInfo }) => (
  <div style={{ display: "inline-block", opacity: challengeInfo.disabled ? 0.5 : 1 }}>
    {challengeInfo.disabled ? (
      <p>{challengeInfo.label}</p>
    ) : (
      <Link to={`/challenge/${challengeId}`}>{challengeInfo.label}</Link>
    )}
    {submissionInfo && <p> [{submissionInfo.status}]</p>}
    {challengeInfo.disabled && <p> (disabled)</p>}
  </div>
);

export default ChallengeCard;
