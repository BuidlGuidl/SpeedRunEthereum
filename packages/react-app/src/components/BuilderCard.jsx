import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { Link, Td } from "@chakra-ui/react";
import Address from "./Address";

const BuilderCard = ({ builder, mainnetProvider }) => {
  const acceptedChallenges =
    builder.challenges &&
    // ToDo. Move "ACCEPTED" to a shared constant.
    Object.keys(builder.challenges).filter(challengeId => builder.challenges[challengeId].status === "ACCEPTED");

  return (
    <>
      <Td>
        <Link as={RouteLink} to={`/builders/${builder.id}`} pos="relative">
          <Address address={builder.id} ensProvider={mainnetProvider} scale="0.4" fontSize="16" />
        </Link>
      </Td>
      <Td>-</Td>
      <Td>{acceptedChallenges ? acceptedChallenges.length : 0}</Td>
    </>
  );
};

export default BuilderCard;
