import React from "react";
import { Link } from "react-router-dom";
import Address from "./Address";

const BuilderCard = ({ builder, mainnetProvider }) => (
  // ToDo. Link to Builder profile.
  <Link to={`/builders/${builder.id}`}>
    <div style={{ display: "inline-block" }}>
      <Address address={builder.id} ensProvider={mainnetProvider} />
    </div>
  </Link>
);

export default BuilderCard;
