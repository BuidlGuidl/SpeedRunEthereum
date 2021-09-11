import React from "react";

const ChallengeCard = ({ challengeInfo, submissionInfo }) => (
  <div style={{ display: "inline-block", opacity: challengeInfo.disabled ? 0.5 : 1 }}>
    {challengeInfo.disabled ? (
      <span>{challengeInfo.label}</span>
    ) : (
      <a href={challengeInfo.url} target="_blank" rel="noreferrer noopener">
        {challengeInfo.label}
      </a>
    )}
    {submissionInfo && <span> [{submissionInfo.status}]</span>}
    {challengeInfo.disabled && <span> (disabled)</span>}
  </div>
);

export default ChallengeCard;
