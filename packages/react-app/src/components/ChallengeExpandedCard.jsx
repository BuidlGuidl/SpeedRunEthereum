import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { chakra, Button, Center, Image, Flex, Spacer, Text } from "@chakra-ui/react";

const ChallengeExpandedCard = ({ challengeId, challenge, challengeIndex }) => (
  <Flex borderWidth="1px" borderRadius="lg" borderColor="gray.200" overflow="hidden" mb={6}>
    <Center bgColor="gray.200" borderBottom="1px" borderColor="gray.200" w="200px" h="200px" flexShrink={0}>
      {challenge.previewImage ? (
        <Image src={challenge.previewImage} objectFit="cover" />
      ) : (
        <Text p={3} textAlign="center">
          {challengeId} image
        </Text>
      )}
    </Center>
    <Flex pt={6} pb={4} px={4} direction="column" grow={1}>
      <Text fontWeight="bold">
        Challenge {challengeIndex}: {challenge.label}
      </Text>
      <Text color="gray.600" mb={4}>
        {challenge.description}
      </Text>
      <Spacer />
      <RouteLink to={`/challenge/${challengeId}`}>
        <Button variant="outline" isFullWidth>
          <span role="img" aria-label="castle icon">
            ⚔️
          </span>
          <chakra.span ml={1}>Quest</chakra.span>
        </Button>
      </RouteLink>
    </Flex>
  </Flex>
);

export default ChallengeExpandedCard;
