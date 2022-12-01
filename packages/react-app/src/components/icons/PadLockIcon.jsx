/* eslint react/jsx-props-no-spreading: off */
// ☝️ we want this component to be usable with chakra props
import React from "react";
import { chakra } from "@chakra-ui/react";

const PadLockIcon = props => (
  <chakra.svg width="24" height="32" {...props} viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.34074 0.919861L7.34075 3.83382H4.42678V13.5834H7.34075V3.83382L16.0582 3.83382V13.5834H18.9721V3.83382L16.0582 3.83382V0.919861H7.34074ZM23.3989 13.5834H0V28.3979H3.39124V31.4993H20.0078V28.3979H23.3989V13.5834ZM13.1564 23.6998H10.2425V17.2047H13.1564V23.6998Z"
      fill="#026262"
    />
  </chakra.svg>
);

export default PadLockIcon;
