import React from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, SkeletonText } from "@chakra-ui/react";
import SkeletonAddress from "./SkeletonAddress";

const BuilderListSkeleton = () => (
  <Box overflowX="auto">
    <Table>
      <Thead>
        <Tr>
          <Th>Builder</Th>
          <Th isNumeric>Builds</Th>
          <Th isNumeric>Challenges</Th>
          <Th isNumeric>Stream</Th>
          <Th isNumeric>Allowance</Th>
          <Th isNumeric>Available</Th>
          <Th textAlign="center">Role</Th>
          <Th />
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
                <SkeletonText noOfLines={1} py={2} />
              </Td>
              <Td>
                <SkeletonText noOfLines={1} py={2} />
              </Td>
              <Td>
                <SkeletonText noOfLines={1} py={2} />
              </Td>
              <Td>
                <SkeletonText noOfLines={1} py={2} />
              </Td>
              <Td>
                <SkeletonText noOfLines={1} py={2} />
              </Td>
              <Td>
                <SkeletonText noOfLines={1} py={2} />
              </Td>
              <Td>
                <SkeletonText noOfLines={1} py={2} />
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  </Box>
);

export default BuilderListSkeleton;
