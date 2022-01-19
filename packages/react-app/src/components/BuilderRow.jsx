import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { Link, Td, Tr } from "@chakra-ui/react";
import Address from "./Address";
import { getAcceptedChallenges } from "../helpers/builders";
import useCustomColorModes from "../hooks/useCustomColorModes";

const BuilderRow = ({ builder, mainnetProvider }) => {
  const { primaryFontColor } = useCustomColorModes();
  const acceptedChallenges = getAcceptedChallenges(builder?.challenges)?.length ?? 0;

  return (
    <Tr color={primaryFontColor}>
      <Td>
        <Link as={RouteLink} to={`/builders/${builder.id}`} pos="relative">
          <Address address={builder.id} ensProvider={mainnetProvider} w="12.5" fontSize="16" />
        </Link>
      </Td>
      <Td>{acceptedChallenges}</Td>
    </Tr>
  );
};

export default BuilderRow;
