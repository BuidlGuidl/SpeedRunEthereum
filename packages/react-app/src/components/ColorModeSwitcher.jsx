import React from "react";
import { Flex, Switch, useColorMode, useColorModeValue } from "@chakra-ui/react";
import MoonIcon from "./icons/MoonIcon";
import SunIcon from "./icons/SunIcon";

const ColorModeSwitcher = () => {
  const { toggleColorMode } = useColorMode();
  const Icon = useColorModeValue(<SunIcon color="gray.400" h={4} w={4} />, <MoonIcon h={4} w={4} />);

  return (
    <Flex pos="fixed" bottom={0} right={0} p={6}>
      <Switch onChange={toggleColorMode} mr={4} align="center" />
      {Icon}
    </Flex>
  );
};

export default ColorModeSwitcher;
