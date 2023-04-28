import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "./index.css";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { IntlProvider } from "react-intl";
import theme from "./theme";
import App from "./App";

import translationEn from "./lang/en.json";
import translationEs from "./lang/es.json";

const translations = {
  en: translationEn,
  es: translationEs,
};

// TODO: change from ui
const userLocale = "en";

const Root = () => {
  const [locale, setLocale] = useState(userLocale);
  return (
    <IntlProvider locale={locale} messages={translations[locale]}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App setLocale={setLocale} />
        </BrowserRouter>
      </ChakraProvider>
    </IntlProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
