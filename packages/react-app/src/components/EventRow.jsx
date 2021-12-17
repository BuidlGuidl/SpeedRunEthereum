import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { Tr, Td, Link } from "@chakra-ui/react";
import Address from "./Address";
import { eventDisplay } from "../helpers/events";
import DateWithTooltip from "./DateWithTooltip";

const EventRow = ({ event }) => {
  const userAddress = event.payload.userAddress;

  return (
    <Tr>
      <Td>
        <Link as={RouteLink} to={`/builders/${userAddress}`} pos="relative">
          <Address address={userAddress} w="12.5" fontSize="16" />
        </Link>
      </Td>
      <Td whiteSpace="nowrap">
        <DateWithTooltip timestamp={event.timestamp} />
      </Td>
      <Td>{eventDisplay(event)}</Td>
    </Tr>
  );
};

export default EventRow;
