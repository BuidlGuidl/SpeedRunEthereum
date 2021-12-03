import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { HStack, Link } from "@chakra-ui/react";

const ChallengeCard = ({ challengeId, challengeInfo, submissionInfo }) => (
  <HStack spacing="6px" style={{ opacity: challengeInfo.disabled ? 0.5 : 1 }}>
    {challengeInfo.disabled ? (
      <p>{challengeInfo.label}</p>
    ) : (
      <Link as={RouteLink} to={`/challenge/${challengeId}`} color="teal.500">
        {challengeInfo.label}
      </Link>
    )}
    {submissionInfo && <p> [{submissionInfo.status}]</p>}
    {challengeInfo.disabled && <p> (disabled)</p>}
  </HStack>
);

export default ChallengeCard;
