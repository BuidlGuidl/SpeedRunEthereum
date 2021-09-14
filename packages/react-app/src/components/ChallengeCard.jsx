import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "antd";

const { Text } = Typography;

const ChallengeCard = ({ challengeId, challengeInfo, submissionInfo }) => (
  <div style={{ display: "inline-block", opacity: challengeInfo.disabled ? 0.5 : 1 }}>
    {challengeInfo.disabled ? (
      <Text>{challengeInfo.label}</Text>
    ) : (
      <Link to={`/challenge/${challengeId}`}>{challengeInfo.label}</Link>
    )}
    {submissionInfo && <Text> [{submissionInfo.status}]</Text>}
    {challengeInfo.disabled && <Text> (disabled)</Text>}
  </div>
);

export default ChallengeCard;
