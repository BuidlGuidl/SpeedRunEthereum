import React from "react";
import moment from "moment";
import { Link as RouteLink } from "react-router-dom";
import { Box, Tr, Td, Link, Tooltip } from "@chakra-ui/react";
import Address from "./Address";
import { eventDisplay } from "../helpers/events";

const EventRow = ({ event }) => {
  const timestampMoment = moment(event.timestamp);
  const userAddress = event.payload.userAddress;

  return (
    <Tr key={`${event.timestamp}_${event.payload.userAddress}`}>
      <Td>
        <Link as={RouteLink} to={`/builders/${userAddress}`} pos="relative">
          <Address address={userAddress} w="12.5" fontSize="16" />
        </Link>
      </Td>
      <Td>
        <Tooltip label={timestampMoment.format("YYYY-MM-DD, HH:mm")}>
          <Box cursor="pointer">{timestampMoment.fromNow()}</Box>
        </Tooltip>
      </Td>
      <Td>{eventDisplay(event)}</Td>
    </Tr>
  );
};

export default EventRow;
