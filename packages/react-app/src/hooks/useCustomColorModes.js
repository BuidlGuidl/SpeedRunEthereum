import { useColorModeValue } from "@chakra-ui/react";

const useCustomColorModes = () => {
  const primaryFontColor = useColorModeValue("gray.700", "gray.200");
  const secondaryFontColor = useColorModeValue("gray.600", "gray.400");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const codeFontColor = useColorModeValue("gray.700", "gray.200");
  const codeBgColor = useColorModeValue("gray.100", "gray.900");

  return {
    primaryFontColor,
    secondaryFontColor,
    dividerColor,
    borderColor,
    codeFontColor,
    codeBgColor,
  };
};

export default useCustomColorModes;
