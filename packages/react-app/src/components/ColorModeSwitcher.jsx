import React from "react";
import { Flex, Switch, useColorMode } from "@chakra-ui/react";
import MoonIcon from "./icons/MoonIcon";
import SunIcon from "./icons/SunIcon";

const ColorModeSwitcher = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isLightMode = colorMode === "light";

  return (
    <Flex pos="fixed" bottom={0} right={0} p={6}>
      <Switch onChange={toggleColorMode} mr={4} align="center" />
      {isLightMode ? <SunIcon color="gray.400" h={4} w={4} /> : <MoonIcon h={4} w={4} />}
    </Flex>
  );
};

export default ColorModeSwitcher;
