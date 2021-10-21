import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
} from "@chakra-ui/react";
import QRPunkBlockie from "./QrPunkBlockie";
import useDisplayAddress from "../hooks/useDisplayAddress";
import { ellipsizedAddress } from "../helpers/strings";
import { USER_ROLES } from "../helpers/constants";
import HeroIconUser from "./icons/HeroIconUser";
import SignatureSignUp from "./SignatureSignUp";

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
  address,
  connectText,
  ensProvider,
  isWalletConnected,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  setUserRole,
  userProvider,
  userRole,
}) {
  const ens = useDisplayAddress(ensProvider, address);
  const shortAddress = ellipsizedAddress(address);
  const history = useHistory();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const registerButtonRef = useRef();
  const openPopover = () => setIsPopoverOpen(true);
  const closePopover = () => setIsPopoverOpen(false);

  const hasEns = ens !== shortAddress;
  const isAdmin = userRole === USER_ROLES.admin;
  const isAnonymous = userRole === USER_ROLES.anonymous;

  const connectWallet = (
    <Button colorScheme="blue" key="loginbutton" onClick={loadWeb3Modal}>
      {connectText || "connect"}
    </Button>
  );

  const UserDisplayName = ({ mb, textAlign }) =>
    hasEns ? (
      <>
        <Text fontSize="md" fontWeight="bold" textAlign={textAlign} color="gray.700">
          {ens}
        </Text>
        <Text color="gray.500" fontSize="sm" fontWeight="normal" textAlign={textAlign} mb={mb}>
          {shortAddress}
        </Text>
      </>
    ) : (
      <Text fontSize="md" fontWeight="semibold" textAlign={textAlign} color="gray.700" mb={mb}>
        {shortAddress}
      </Text>
    );

  const accountMenu = address && (
    <Menu>
      <MenuButton
        p="px"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius={8}
        _focus={{ boxShadow: "none" }}
        _hover={{ opacity: 0.8 }}
      >
        <QRPunkBlockie withQr={false} address={address.toLowerCase()} w={9} borderRadius={6} />
      </MenuButton>
      <MenuList color="gray.600">
        <MenuItem as={Box} _focus={{ background: "none" }} _active={{ background: "none" }}>
          <Flex align="center">
            <QRPunkBlockie withQr={false} address={address.toLowerCase()} w={14} borderRadius={6} />
            <Box ml={4}>
              {/* ToDo. Move to Utils */}
              <UserDisplayName textAlign="left" />
            </Box>
          </Flex>
        </MenuItem>
        <MenuDivider />
        <MenuItem as={Link} fontWeight="normal" to="/my-profile" d="block">
          My profile
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={logoutOfWeb3Modal}>Disconnect Wallet</MenuItem>
      </MenuList>
    </Menu>
  );

  const handleSignUpSuccess = () => {
    closePopover();
    history.push("/my-profile");
  };

  const anonymousMenu = address && (
    <Popover placement="bottom-end" initialFocusRef={registerButtonRef} isOpen={isPopoverOpen} onClose={closePopover}>
      <PopoverTrigger>
        <Button variant="ghost" _hover={{ backgroundColor: "gray.50" }} w={9} p={0} onClick={openPopover}>
          <Icon as={HeroIconUser} w={6} h={6} color="gray.500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent w={72}>
        <PopoverBody
          as={Flex}
          direction="column"
          px={9}
          py={10}
          _focus={{ background: "none" }}
          _active={{ background: "none" }}
        >
          <Text color="gray.700" fontWeight="bold" textAlign="center" mb={1}>
            Register as a builder
          </Text>
          <Text color="gray.600" fontSize="sm" fontWeight="normal" textAlign="center" mb={6}>
            Sign a message with your wallet to create a builder profile.
          </Text>
          <Box m="auto" p="px" borderWidth="1px" borderColor="gray.200" borderRadius={8}>
            <QRPunkBlockie address={address} w={19} borderRadius={6} />
          </Box>
          <UserDisplayName textAlign="center" mb={6} />
          <SignatureSignUp
            ref={registerButtonRef}
            userProvider={userProvider}
            address={address}
            onSuccess={handleSignUpSuccess}
            setUserRole={setUserRole}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );

  const userMenu = isAnonymous ? anonymousMenu : accountMenu;

  return (
    <Flex align="center">
      {isAdmin && (
        <Badge colorScheme="red" mr={4}>
          admin
        </Badge>
      )}
      {isWalletConnected ? userMenu : connectWallet}
    </Flex>
  );
}
