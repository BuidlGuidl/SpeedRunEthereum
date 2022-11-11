import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import App from "./App";
import { IntlProvider } from "react-intl";

import translationEN from "./lang/en.json";
import translationES from "./lang/es.json";

const translations = {
  en: translationEN,
  es: translationES,
};

// ToDo. Change from UI.
const usersLocale = "en";

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <IntlProvider locale={usersLocale} messages={translations[usersLocale]}>
      <BrowserRouter>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </BrowserRouter>
    </IntlProvider>
  </ChakraProvider>,
  document.getElementById("root"),
);
