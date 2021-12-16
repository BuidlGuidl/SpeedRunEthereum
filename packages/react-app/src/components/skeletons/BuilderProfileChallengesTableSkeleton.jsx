import React from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Skeleton, SkeletonText } from "@chakra-ui/react";

const BuilderProfileChallengesTableSkeleton = () => (
  <Box overflowX="auto">
    <Table>
      <Thead>
        <Tr>
          <Th w="30%">Name</Th>
          <Th>Contract</Th>
          <Th>Live Demo</Th>
          <Th>Updated</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {[1, 2].map(lineNumber => {
          return (
            <Tr key={lineNumber}>
              <Td>
                <SkeletonText noOfLines={1} py={2} />
              </Td>
              <Td>
                <SkeletonText noOfLines={1} w="50%" />
              </Td>
              <Td>
                <SkeletonText noOfLines={1} w="50%" />
              </Td>
              <Td>
                <SkeletonText noOfLines={1} />
              </Td>
              <Td>
                <Skeleton h={6} w={20} borderRadius="full">
                  Submitted
                </Skeleton>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  </Box>
);

export default BuilderProfileChallengesTableSkeleton;
