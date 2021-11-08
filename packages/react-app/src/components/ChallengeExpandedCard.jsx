import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { Box, Button, Center, Flex, Spacer, Text } from "@chakra-ui/react";

const ChallengeExpandedCard = ({ challengeId, challenge }) => (
  <Box borderWidth="1px" borderRadius="lg" borderColor="gray.200" overflow="hidden">
    <Center bgColor="gray.200" borderBottom="1px" borderColor="gray.200" h="200px">
      <Text>{challengeId} image</Text>
    </Center>
    <Flex pt={9} pb={4} px={4} direction="column" minH="240px">
      <Text fontWeight="bold">{challenge.label}</Text>
      <Text color="gray.600">{challenge.description}</Text>
      <Spacer />
      <RouteLink to={`/challenge/${challengeId}`}>
        <Button variant="outline" isFullWidth>
          ⚔️ Quest
        </Button>
      </RouteLink>
    </Flex>
  </Box>
);

export default ChallengeExpandedCard;
