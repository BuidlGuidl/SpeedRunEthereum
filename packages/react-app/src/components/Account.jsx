import React from "react";
import { Link } from "react-router-dom";
import { Badge, Box, Button, Flex, Menu, MenuButton, MenuDivider, MenuList, MenuItem, Text } from "@chakra-ui/react";
import QRPunkBlockie from "./QrPunkBlockie";
import { useLookupAddress } from "../hooks";

/*
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    address={address}
    localProvider={localProvider}
    userProvider={userProvider}
    mainnetProvider={mainnetProvider}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logoutOfWeb3Modal={logoutOfWeb3Modal}
    blockExplorer={blockExplorer}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
*/

export default function Account({
  connectText,
  isWalletConnected,
  address,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  isAdmin,
  ensProvider,
}) {
  const connectWallet = (
    <Button colorScheme="blue" key="loginbutton" onClick={loadWeb3Modal}>
      {connectText || "connect"}
    </Button>
  );

  const ens = useLookupAddress(ensProvider, address);

  const accountMenu = address && (
    <Menu>
      <MenuButton as={Button} px={0} variant="ghost" _focus={{ boxShadow: "none" }} _hover={{ opacity: 0.8 }}>
        <QRPunkBlockie withQr={false} address={address.toLowerCase()} scale={0.4} />
      </MenuButton>
      <MenuList>
        <MenuItem as={Box} _focus={{ background: "none" }} _active={{ background: "none" }}>
          <Flex>
            <Box pos="relative">
              <QRPunkBlockie withQr={false} address={address.toLowerCase()} scale={0.6} />
            </Box>
            <Box ml={3} mt={2}>
              {ens && (
                <Text fontWeight="bold" lineHeight={1.3}>
                  {ens}
                </Text>
              )}
              <Text color="gray.500" lineHeight={1.3}>
                {/* ToDo. Move to Utils */}
                {address.substr(0, 6) + "..." + address.substr(-4)}
              </Text>
            </Box>
          </Flex>
        </MenuItem>
        <MenuDivider />
        <MenuItem as={Link} to="/my-profile" d="block">
          My profile
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={logoutOfWeb3Modal}>Disconnect Wallet</MenuItem>
      </MenuList>
    </Menu>
  );

  return (
    <div>
      {isAdmin && (
        <Badge colorScheme="red" mr={4}>
          admin
        </Badge>
      )}
      {isWalletConnected ? accountMenu : connectWallet}
    </div>
  );
}
