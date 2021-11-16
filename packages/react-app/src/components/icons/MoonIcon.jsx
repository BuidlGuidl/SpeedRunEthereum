/* eslint react/jsx-props-no-spreading: off */
// ☝️ we want this component to be usable with chakra props
import React from "react";
import { chakra } from "@chakra-ui/react";

const MoonIcon = props => (
  <chakra.svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 512 512" stroke="currentColor">
    <path
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      d="M 283.211 512 c 78.962 0 151.079 -35.925 198.857 -94.792 c 7.068 -8.708 -0.639 -21.43 -11.562 -19.35 c -124.203 23.654 -238.262 -71.576 -238.262 -196.954 c 0 -72.222 38.662 -138.635 101.498 -174.394 c 9.686 -5.512 7.25 -20.197 -3.756 -22.23 A 258.156 258.156 0 0 0 283.211 0 c -141.309 0 -256 114.511 -256 256 c 0 141.309 114.511 256 256 256 Z"
    />
  </chakra.svg>
);

export default MoonIcon;
