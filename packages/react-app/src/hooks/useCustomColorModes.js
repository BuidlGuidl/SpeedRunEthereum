import { useColorModeValue } from "@chakra-ui/react";

const useCustomColorModes = () => {
  const primaryFontColor = useColorModeValue("sre.text", "sreDark.text");
  const codeFontColor = primaryFontColor;
  const secondaryFontColor = useColorModeValue("gray.600", "gray.300");
  const dividerColor = useColorModeValue("sre.default", "sreDark.default");
  const borderColor = dividerColor;
  const codeBgColor = useColorModeValue("gray.100", "gray.900");
  const iconBgColor = codeBgColor;
  const linkColor = useColorModeValue("sre.default", "sreDark.default");
  const linkAltColor = useColorModeValue("sre.linkAlt", "sreDark.linkAlt");

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
    linkAltColor,
  };
};

export default useCustomColorModes;
