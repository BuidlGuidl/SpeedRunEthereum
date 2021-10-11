import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem("theme");

ReactDOM.render(
  <ChakraProvider>
    <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || "light"}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeSwitcherProvider>
  </ChakraProvider>,
  document.getElementById("root"),
);
