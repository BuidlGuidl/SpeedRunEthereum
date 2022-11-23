import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
  styles: {
    global: {
      strong: {
        fontWeight: 500,
      },
    },
  },
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
      cardBackground: "#E9FBFF",
      bgBannerBackground: "#67DDDE",
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
