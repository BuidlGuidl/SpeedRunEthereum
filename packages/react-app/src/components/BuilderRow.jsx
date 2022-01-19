import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { Flex, Link, Td, Tr } from "@chakra-ui/react";
import Address from "./Address";
import { getAcceptedChallenges } from "../helpers/builders";
import useCustomColorModes from "../hooks/useCustomColorModes";
import SocialLink from "./SocialLink";

const BuilderRow = ({ builder, mainnetProvider }) => {
  const { primaryFontColor } = useCustomColorModes();
  const acceptedChallenges = getAcceptedChallenges(builder?.challenges)?.length ?? 0;
  const hasProfileLinks = builder?.socialLinks ? Object.keys(builder.socialLinks).length !== 0 : false;

  return (
    <Tr color={primaryFontColor}>
      <Td>
        <Link as={RouteLink} to={`/builders/${builder.id}`} pos="relative">
          <Address address={builder.id} ensProvider={mainnetProvider} w="12.5" fontSize="16" />
        </Link>
      </Td>
      <Td>{acceptedChallenges}</Td>
      <Td>
        {hasProfileLinks ? (
          <Flex justifyContent="space-evenly" alignItems="center">
            {Object.entries(builder.socialLinks).map(([socialId, socialValue]) => (
              <SocialLink id={socialId} value={socialValue} />
            ))}
          </Flex>
        ) : (
          "-"
        )}
      </Td>
    </Tr>
  );
};

export default BuilderRow;
