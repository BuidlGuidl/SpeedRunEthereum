import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { Link } from "@chakra-ui/react";
import Address from "./Address";

const BuilderCard = ({ builder, mainnetProvider }) => (
  <Link as={RouteLink} to={`/builders/${builder.id}`} pos="relative">
    <Address address={builder.id} ensProvider={mainnetProvider} scale="0.4" />
  </Link>
);

export default BuilderCard;
