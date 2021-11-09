/* eslint react/jsx-props-no-spreading: off */
// ☝️ we want this component to be usable with chakra props
import React from "react";
import { chakra } from "@chakra-ui/react";

const EthIcon = props => (
  <chakra.svg {...props} display="inline" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50.4925 9L49.9353 10.8915V65.7723L50.4925 66.3279L75.9844 51.2696L50.4925 9Z" fill="#343434" />
    <path d="M50.4925 9L25 51.2696L50.4925 66.3279V39.6902V9Z" fill="#8C8C8C" />
    <path d="M50.4925 71.1511L50.1785 71.5338V91.0832L50.4925 91.9994L76 56.1006L50.4925 71.1511Z" fill="#3C3C3B" />
    <path d="M50.4925 91.9994V71.1511L25 56.1006L50.4925 91.9994Z" fill="#8C8C8C" />
    <path d="M50.4924 66.3279L75.9843 51.2697L50.4924 39.6902V66.3279Z" fill="#141414" />
    <path d="M25 51.2697L50.4925 66.3279V39.6902L25 51.2697Z" fill="#393939" />
  </chakra.svg>
);

export default EthIcon;
