import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { useColorModeValue, chakra, Button, Center, Image, Flex, Spacer, Text } from "@chakra-ui/react";

const ChallengeExpandedCard = ({ challengeId, challenge, challengeIndex }) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const secondaryFontColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Flex borderWidth="1px" borderRadius="lg" borderColor={borderColor} overflow="hidden" mb={6}>
      <Center bgColor={borderColor} borderBottom="1px" borderColor={borderColor} w="200px" h="200px" flexShrink={0}>
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
        <Text color={secondaryFontColor} mb={4}>
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
};

export default ChallengeExpandedCard;
