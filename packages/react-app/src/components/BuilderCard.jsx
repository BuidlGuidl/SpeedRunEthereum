import React from "react";
import Address from "./Address";

const BuilderCard = ({ builder, mainnetProvider }) => (
  // ToDo. Link to Builder profile.
  <div style={{ display: "inline-block" }}>
    <Address
      address={builder.id}
      ensProvider={mainnetProvider}
    />
  </div>
);

export default BuilderCard;
