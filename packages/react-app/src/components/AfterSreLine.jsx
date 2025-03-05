import React from "react";
import { chakra, Box, Flex } from "@chakra-ui/react";
import useCustomColorModes from "../hooks/useCustomColorModes";

const AfterSreLine = () => {
  const { bgColor, borderColor } = useCustomColorModes();

  return (
    <Flex
      justifyContent="space-between"
      maxW="min(80rem, calc(100vw - 113px))"
      w="100%"
      top="0"
      height={48}
      ml={14}
      mr={14}
      position="absolute"
      display={{ base: "none", xl: "flex" }}
    >
      <Box
        w="calc(50% + 110px)"
        h="40px"
        borderLeftStyle="dashed"
        borderLeftWidth="5px"
        borderLeftColor={borderColor}
        borderBottomStyle="dashed"
        borderBottomWidth="5px"
        borderBottomColor={borderColor}
        borderRadius="0 0 0 10px"
      />
      <Box
        position="absolute"
        top="35px"
        left="105px"
        w="20px"
        h="40px"
        borderRightStyle="dashed"
        borderRightWidth="5px"
        borderRightColor={borderColor}
        borderRadius="0 10px 0 0"
        display={{ base: "none", xl: "flex" }}
      />
      <chakra.span
        h={5}
        w={5}
        rounded="full"
        backgroundColor={bgColor}
        border="4px"
        borderColor={borderColor}
        position="absolute"
        top={75}
        left={112}
        display="flex"
      />
      <Box
        position="absolute"
        top="35px"
        left="calc(50% + 100px)"
        w="20px"
        h="40px"
        borderRightStyle="dashed"
        borderRightWidth="5px"
        borderRightColor={borderColor}
        borderRadius="0 10px 0 0"
        display={{ base: "none", xl: "flex" }}
      />
      <chakra.span
        h={5}
        w={5}
        rounded="full"
        backgroundColor={bgColor}
        border="4px"
        borderColor={borderColor}
        position="absolute"
        top={75}
        left="calc(50% + 108px)"
        display="flex"
      />
    </Flex>
  );
};

export default AfterSreLine;
