import React from "react";
import { Switch, useColorMode } from "@chakra-ui/react"

const ColorModeSwitcher = () => {
  const { toggleColorMode } = useColorMode();

  return (
    <Switch
      onChange={toggleColorMode}
      pos="fixed"
      bottom={0}
      right={0}
      p={6}
    />
  );
};

export default ColorModeSwitcher;
