import React from "react";
import { Box, Button, Flex, Image, Link, Text } from "@chakra-ui/react";
import useCustomColorModes from "../../hooks/useCustomColorModes";

const BG_FRONTEND_URL = "https://buidlguidl.com";

export const JoinedBuidlGuidlBanner = ({ builderAddress }) => {
  const { borderColor } = useCustomColorModes();

  return (
    <Box borderColor={borderColor} borderWidth={1} p={5}>
      <Flex direction="column" align="center" justify="center">
        <Image src="/assets/bg.png" mb={3} />
        <Text mb={3} fontSize="lg" fontWeight="bold">
          This builder has upgraded to BuidlGuidl.
        </Text>
        <Button as={Link} href={`${BG_FRONTEND_URL}/builders/${builderAddress}`} isExternal colorScheme="blue">
          View their profile on Buidlguidl
        </Button>
      </Flex>
    </Box>
  );
};
