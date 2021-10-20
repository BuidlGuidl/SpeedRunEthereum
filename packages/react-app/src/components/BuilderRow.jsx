import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { Link, Td, Tr } from "@chakra-ui/react";
import Address from "./Address";
import { getAcceptedChallenges } from "../helpers/builders";

const BuilderRow = ({ builder, mainnetProvider }) => {
  const acceptedChallenges = getAcceptedChallenges(builder?.challenges);
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
