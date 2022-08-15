import React from "react";
import { Box, ButtonGroup, Center, Flex, Image, Spacer, Text } from "@chakra-ui/react";
import useCustomColorModes from "../../hooks/useCustomColorModes";
import JoinBG from "../JoinBG";

export const JoinBuidlGuidlBanner = ({ challenge, userProvider, connectedBuilder, onJoinCallback }) => {
  const { borderColor, secondaryFontColor } = useCustomColorModes();

  return (
    <Box bg="#f9f9f9">
      <Flex maxW={500} overflow="hidden" m="0 auto 24px">
        <Flex pt={6} pb={4} px={4} direction="column" grow={1}>
          <Flex alignItems="center" pb={4} direction="column">
            <Text fontWeight="bold" fontSize="lg" mb={2}>
              {challenge.label}
            </Text>
            <Center borderBottom="1px" borderColor={borderColor} w="200px" flexShrink={0} p={1}>
              <Image src={`/${challenge.previewImage}`} objectFit="cover" />
            </Center>
          </Flex>
          <Text color={secondaryFontColor} mb={4} textAlign="center">
            {challenge.description}
          </Text>
          <Spacer />
          <ButtonGroup>
            <JoinBG
              text={challenge.externalLink.claim}
              isChallengeLocked={false}
              userProvider={userProvider}
              connectedBuilder={connectedBuilder}
              onJoinCallback={onJoinCallback}
            />
          </ButtonGroup>
        </Flex>
      </Flex>
    </Box>
  );
};
