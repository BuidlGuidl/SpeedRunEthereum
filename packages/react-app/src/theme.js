import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
  colors: {
    sre: {
      default: "#088484",
      text: "#026262",
      background: "#C8F5FF",
      cardBackground: "#E9FBFF",
    },
    sreDark: {
      default: "#C8F5FF",
      text: "#C8F5FF",
      background: "#088484",
      cardBackground: "#026262",
    },
    green: {
      500: "#088484",
    },
  },
});

export default theme;
