import { useColorModeValue } from "@chakra-ui/react";

const useCustomColorModes = () => {
  const primaryFontColor = useColorModeValue("sre.text", "sreDark.text");
  const codeFontColor = primaryFontColor;
  const secondaryFontColor = useColorModeValue("gray.600", "gray.400");
  const dividerColor = useColorModeValue("sre.default", "sreDark.default");
  const borderColor = dividerColor;
  const codeBgColor = useColorModeValue("gray.100", "gray.900");
  const iconBgColor = codeBgColor;
  const linkColor = useColorModeValue("#088484", "#C8F5FF");

  const bgColor = useColorModeValue("sre.background", "sreDark.background");

  return {
    bgColor,
    primaryFontColor,
    secondaryFontColor,
    dividerColor,
    borderColor,
    codeFontColor,
    codeBgColor,
    iconBgColor,
    linkColor,
  };
};

export default useCustomColorModes;
