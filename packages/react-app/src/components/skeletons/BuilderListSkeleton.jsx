import React from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, SkeletonText, Center, chakra } from "@chakra-ui/react";
import SkeletonAddress from "./SkeletonAddress";

const BuilderListSkeleton = () => (
  <Box overflowX="auto">
    <Center mb={5}>
      <chakra.strong mr={2}>Total builders:</chakra.strong> <SkeletonText noOfLines={1} w={5} />
    </Center>
    <Table>
      <Thead>
        <Tr>
          <Th>Builder</Th>
          <Th>Challenges</Th>
          <Th>Socials</Th>
          <Th>Last Activity</Th>
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
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  </Box>
);

export default BuilderListSkeleton;
