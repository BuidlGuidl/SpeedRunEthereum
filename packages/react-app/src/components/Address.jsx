import React from "react";
import { HStack } from "@chakra-ui/react";
import QRPunkBlockie from "./QrPunkBlockie";
import { useLookupAddress } from "../hooks";

/*
  ~ What it does? ~

  Displays an address with a blockie image and option to copy address

  ~ How can I use? ~

  <Address
    address={address}
    ensProvider={mainnetProvider}
    blockExplorer={blockExplorer}
    fontSize={fontSize}
  />

  ~ Features ~

  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
  - Provide fontSize={fontSize} to change the size of address text
*/

export default function Address(props) {
  const address = props.value || props.address;

  const ens = useLookupAddress(props.ensProvider, address);

  if (!address) {
    return <span>Loading...</span>;
  }

  let displayAddress = address.substr(0, 6);

  if (ens && ens.indexOf("0x") < 0) {
    displayAddress = ens;
  } else if (props.size === "short") {
    displayAddress += "..." + address.substr(-4);
  } else if (props.size === "long") {
    displayAddress = address;
  }

  return (
    <HStack spacing="20px">
      <span style={{ verticalAlign: "middle" }}>
        <QRPunkBlockie withQr={false} address={address.toLowerCase()} scale={props.scale ?? 1} />
      </span>
      <span
        style={{
          verticalAlign: "middle",
          fontSize: props.fontSize ? props.fontSize : 28,
        }}
      >
        {displayAddress}
      </span>
    </HStack>
  );
}
