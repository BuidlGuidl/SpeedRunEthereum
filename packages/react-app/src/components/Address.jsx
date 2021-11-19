import React, { useContext } from "react";
import { HStack } from "@chakra-ui/react";
import QRPunkBlockie from "./QrPunkBlockie";
import { useLookupAddress } from "../hooks";
import BlockchainProvidersContext from "../contexts/blockchainProvidersContext";

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

// INFO: Address used to have ensProvider as prop. That's no longer needed.
export default function Address({ value, address: sentAddress, size, w, fontSize }) {
  const address = value || sentAddress;

  const mainnetProviderData = useContext(BlockchainProvidersContext).mainnet;
  const mainnetProvider = mainnetProviderData.provider;

  const ens = useLookupAddress(mainnetProvider, address);

  if (!address) {
    return <span>Loading...</span>;
  }

  let displayAddress = address.substr(0, 6);

  if (ens && ens.indexOf("0x") < 0) {
    displayAddress = ens;
  } else if (size === "short") {
    displayAddress += "..." + address.substr(-4);
  } else if (size === "long") {
    displayAddress = address;
  }

  return (
    <HStack spacing="20px">
      <span style={{ verticalAlign: "middle" }}>
        <QRPunkBlockie withQr={false} address={address.toLowerCase()} w={w ?? 12.5} borderRadius="md" />
      </span>
      <span
        style={{
          verticalAlign: "middle",
          fontSize: fontSize ?? 28,
          fontWeight: "bold",
        }}
      >
        {displayAddress}
      </span>
    </HStack>
  );
}
