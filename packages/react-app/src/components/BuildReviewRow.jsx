import React from "react";
import moment from "moment";
import { Link as RouteLink } from "react-router-dom";
import { Button, Box, HStack, Link, Td, Tr, Tooltip, SkeletonText } from "@chakra-ui/react";
import Address from "./Address";

export default function BuildReviewRow({ build, submittedTimestamp, isLoading, approveClick, rejectClick }) {
  const submittedMoment = moment(submittedTimestamp);
  return (
    <Tr>
      <Td>
        <Link as={RouteLink} to={`/builders/${build.address}`} pos="relative">
          <Address address={build.address} w="12.5" fontSize="16" />
        </Link>
      </Td>
      <Td>{build.name}</Td>
      <Td>{build.desc}</Td>
      <Td>
        <Link href={build.branch} color="teal.500" target="_blank" rel="noopener noreferrer">
          {build.branch}
        </Link>
      </Td>
      <Td>
        {!submittedTimestamp ? (
          <SkeletonText noOfLines={1} py={4} />
        ) : (
          <Tooltip label={submittedMoment.format("YYYY-MM-DD, HH:mm")}>
            <Box cursor="pointer">{submittedMoment.fromNow()}</Box>
          </Tooltip>
        )}
      </Td>
      <Td>
        <HStack spacing={3}>
          <Button
            type="button"
            colorScheme="red"
            disabled={isLoading}
            className="danger"
            onClick={() => rejectClick(build.address, build.id)}
            size="xs"
          >
            Reject
          </Button>
          <Button
            type="button"
            colorScheme="green"
            disabled={isLoading}
            style={{ marginRight: 10 }}
            onClick={() => approveClick(build.address, build.id)}
            size="xs"
          >
            Approve
          </Button>
        </HStack>
      </Td>
    </Tr>
  );
}
