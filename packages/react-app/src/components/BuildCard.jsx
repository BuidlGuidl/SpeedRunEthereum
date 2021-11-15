import React from "react";
import { Image, Box, Flex, Button, ButtonGroup, Text, Spacer } from "@chakra-ui/react";
import useCustomColorModes from "../hooks/useCustomColorModes";

const ASSETS_BASE_URL = "https://buidlguidl.com/assets";

const BuildCard = ({ build }) => {
  const { borderColor, secondaryFontColor } = useCustomColorModes();
  return (
    <Box borderWidth="1px" borderRadius="lg" borderColor={borderColor} overflow="hidden">
      <Box bgColor={borderColor} borderBottom="1px" borderColor={borderColor}>
        <Image src={`${ASSETS_BASE_URL}/${build.image}`} h="200px" mx="auto" />
      </Box>
      <Flex pt={9} pb={4} px={4} direction="column" minH="240px">
        <Text fontWeight="bold">{build.name}</Text>
        <Text color={secondaryFontColor}>{build.desc}</Text>
        <Spacer />
        <ButtonGroup variant="outline" size="sm" spacing="2">
          <Button disabled variant="outline" isFullWidth>
            Fund
          </Button>
          <Button isFullWidth as="a" href={build.branch} target="_blank" rel="noopener noreferrer">
            Fork
          </Button>
        </ButtonGroup>
      </Flex>
    </Box>
  );
};

export default BuildCard;
