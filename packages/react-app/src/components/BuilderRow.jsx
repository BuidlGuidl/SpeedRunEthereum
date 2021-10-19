import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { Link, Td, Tr } from "@chakra-ui/react";
import Address from "./Address";

const BuilderRow = ({ builder, mainnetProvider }) => {
  const acceptedChallenges =
    builder.challenges &&
    // ToDo. Move "ACCEPTED" to a shared constant.
    Object.keys(builder.challenges).filter(challengeId => builder.challenges[challengeId].status === "ACCEPTED");

  return (
    <Tr key={builder.id}>
      <Td>
        <Link as={RouteLink} to={`/builders/${builder.id}`} pos="relative">
          <Address address={builder.id} ensProvider={mainnetProvider} w="12.5" fontSize="16" />
        </Link>
      </Td>
      <Td>{acceptedChallenges ? acceptedChallenges.length : 0}</Td>
    </Tr>
  );
};

export default BuilderRow;
