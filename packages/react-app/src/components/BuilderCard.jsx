import React from "react";
import { Link } from "react-router-dom";
import Address from "./Address";

const BuilderCard = ({ builder, mainnetProvider }) => (
  <Link to={`/builders/${builder.id}`} style={{ display: "inline-block" }}>
    <Address address={builder.id} ensProvider={mainnetProvider} />
  </Link>
);

export default BuilderCard;
