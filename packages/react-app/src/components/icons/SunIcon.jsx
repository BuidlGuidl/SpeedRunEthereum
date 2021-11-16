/* eslint react/jsx-props-no-spreading: off */
// ☝️ we want this component to be usable with chakra props
import React from "react";
import { chakra } from "@chakra-ui/react";

const SunIcon = props => (
  <chakra.svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 512 512" stroke="currentColor">
    <path
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      d="M 256 160 c -52.9 0 -96 43.1 -96 96 s 43.1 96 96 96 s 96 -43.1 96 -96 s -43.1 -96 -96 -96 Z m 246.4 80.5 l -94.7 -47.3 l 33.5 -100.4 c 4.5 -13.6 -8.4 -26.5 -21.9 -21.9 l -100.4 33.5 l -47.4 -94.8 c -6.4 -12.8 -24.6 -12.8 -31 0 l -47.3 94.7 L 92.7 70.8 c -13.6 -4.5 -26.5 8.4 -21.9 21.9 l 33.5 100.4 l -94.7 47.4 c -12.8 6.4 -12.8 24.6 0 31 l 94.7 47.3 l -33.5 100.5 c -4.5 13.6 8.4 26.5 21.9 21.9 l 100.4 -33.5 l 47.3 94.7 c 6.4 12.8 24.6 12.8 31 0 l 47.3 -94.7 l 100.4 33.5 c 13.6 4.5 26.5 -8.4 21.9 -21.9 l -33.5 -100.4 l 94.7 -47.3 c 13 -6.5 13 -24.7 0.2 -31.1 Z m -155.9 106 c -49.9 49.9 -131.1 49.9 -181 0 c -49.9 -49.9 -49.9 -131.1 0 -181 c 49.9 -49.9 131.1 -49.9 181 0 c 49.9 49.9 49.9 131.1 0 181 Z"
    />
  </chakra.svg>
);

export default SunIcon;
