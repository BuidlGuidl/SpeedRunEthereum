import React from "react";
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, HStack, Skeleton, SkeletonText } from "@chakra-ui/react";
import SkeletonAddress from "./SkeletonAddress";

export const BuildsTableSkeleton = () => (
  <Box overflowX="auto">
    <Table mb={4}>
      <Thead>
        <Tr>
          <Th>Builder</Th>
          <Th>Build Name</Th>
          <Th>Description</Th>
          <Th>Branch URL</Th>
          <Th>Submitted time</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {[1, 2].map(lineNumber => {
          return (
            <Tr key={lineNumber}>
              <Td>
                <SkeletonAddress w="12.5" fontSize="16" />
              </Td>
              <Td>
                <SkeletonText noOfLines={1} py={4} />
              </Td>
              <Td>
                <SkeletonText noOfLines={1} py={4} />
              </Td>
              <Td>
                <SkeletonText noOfLines={1} py={4} />
              </Td>
              <Td>
                <SkeletonText noOfLines={1} py={4} />
              </Td>
              <Td>
                <HStack spacing={3}>
                  <Skeleton startColor="red.100" endColor="red.500">
                    <Button type="button" size="xs">
                      Reject
                    </Button>
                  </Skeleton>
                  <Skeleton startColor="green.100" endColor="green.500">
                    <Button type="button" style={{ marginRight: 10 }} size="xs">
                      Approve
                    </Button>
                  </Skeleton>
                </HStack>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  </Box>
);

export const ChallengesTableSkeleton = () => (
  <Box overflowX="auto">
    <Table mb={4}>
      <Thead>
        <Tr>
          <Th>Builder</Th>
          <Th>Challenge</Th>
          <Th>Contract</Th>
          <Th>Live demo</Th>
          <Th>Submitted time</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {[1, 2].map(lineNumber => {
          return (
            <Tr key={lineNumber}>
              <Td>
                <SkeletonAddress w="12.5" fontSize="16" />
              </Td>
              <Td>
                <SkeletonText noOfLines={1} py={4} />
              </Td>
              <Td>
                <SkeletonText noOfLines={1} py={4} />
              </Td>
              <Td>
                <SkeletonText noOfLines={1} py={4} />
              </Td>
              <Td>
                <SkeletonText noOfLines={1} py={4} />
              </Td>
              <Td>
                <Skeleton startColor="blue.100" endColor="blue.500">
                  <Button type="button" size="xs">
                    Review
                  </Button>
                </Skeleton>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  </Box>
);
