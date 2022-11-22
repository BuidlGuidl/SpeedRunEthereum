import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
  fonts: {
    heading: `'Space Grotesk', sans-serif`,
    body: `'Space Grotesk', sans-serif`,
  },
  fontWeights: {
    bold: 500,
  },
  colors: {
    sre: {
      default: "#088484",
      text: "#026262",
      background: "#C8F5FF",
    },
    sreDark: {
      default: "#C8F5FF",
      text: "#C8F5FF",
      background: "#088484",
    },
    green: {
      500: "#088484",
    },
  },
});

export default theme;
