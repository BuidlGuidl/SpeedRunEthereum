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
  components: {
    Button: {
      baseStyle: {
        borderRadius: "3xl",
        fontWeight: "bold",
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
      linkAlt: "#2FBABB",
    },
    sreDark: {
      default: "#C8F5FF",
      text: "#C8F5FF",
      background: "#088484",
      cardBackground: "#026262",
      linkAlt: "#67DDDE",
    },
    green: {
      100: "#C8F5FF",
      200: "#C8F5FF",
      300: "#E9FBFF",
      500: "#088484",
      600: "#026262",
      700: "#088484",
    },
  },
});

export default theme;
