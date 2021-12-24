import React, { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AvatarBadge,
  Badge,
  Box,
  Button,
  Flex,
  Link,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Spinner,
  Text,
  Tooltip,
  useToast,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import QRPunkBlockie from "./QrPunkBlockie";
import useDisplayAddress from "../hooks/useDisplayAddress";
import useCustomColorModes from "../hooks/useCustomColorModes";
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
  const toast = useToast({ position: "top", isClosable: true });
  const [isPopoverOpen, setIsPopoverOpen] = useState(true);
  const registerButtonRef = useRef();
  const openPopover = () => setIsPopoverOpen(true);
  const closePopover = () => setIsPopoverOpen(false);
  const { primaryFontColor, secondaryFontColor, dividerColor } = useCustomColorModes();

  if (!userRole && isWalletConnected) {
    return <Spinner />;
  }

  const hasEns = ens !== shortAddress;
  const isAdmin = userRole === USER_ROLES.admin;
  const isBuilder = userRole === USER_ROLES.builder;
  const isAnonymous = userRole === USER_ROLES.anonymous;

  const connectWallet = (
    <Button colorScheme="blue" key="loginbutton" onClick={loadWeb3Modal}>
      {connectText || "connect"}
    </Button>
  );

  const UserDisplayName = ({ mb, textAlign }) =>
    hasEns ? (
      <>
        <Text fontSize="md" fontWeight="bold" textAlign={textAlign} color={primaryFontColor}>
          {ens}
        </Text>
        <Text color={secondaryFontColor} fontSize="sm" fontWeight="normal" textAlign={textAlign} mb={mb}>
          {shortAddress}
        </Text>
      </>
    ) : (
      <Text fontSize="md" fontWeight="semibold" textAlign={textAlign} color={primaryFontColor} mb={mb}>
        {shortAddress}
      </Text>
    );

  const accountMenu = address && (
    <LinkBox>
      <Flex align="center">
        <LinkOverlay as={NavLink} to="/portfolio">
          <QRPunkBlockie withQr={false} address={address.toLowerCase()} w={9} borderRadius={6} />
        </LinkOverlay>
        <Box ml={4}>
          {/* ToDo. Move to Utils */}
          <UserDisplayName textAlign="left" />
        </Box>
        <Tooltip label="Disconnect wallet">
          <Button ml={4} onClick={logoutOfWeb3Modal} variant="outline" size="sm">
            X
          </Button>
        </Tooltip>
      </Flex>
    </LinkBox>
  );

  const handleSignUpSuccess = () => {
    closePopover();
    toast({
      title: "You are now registered!",
      description: (
        <>
          Visit{" "}
          <Link href="/portfolio" textDecoration="underline">
            your portfolio
          </Link>{" "}
          to start building
        </>
      ),
      status: "success",
    });
  };

  const anonymousMenu = address && (
    <Popover placement="bottom-end" initialFocusRef={registerButtonRef} isOpen={isPopoverOpen} onClose={closePopover}>
      <PopoverTrigger>
        <Button variant="ghost" _hover={{ backgroundColor: "gray.50" }} w={9} p={0} onClick={openPopover}>
          <Box>
            <Icon as={HeroIconUser} w={6} h={6} color={secondaryFontColor} />
            <AvatarBadge boxSize={2} bg="red.500" borderRadius="full" top="4px" right="4px" />
          </Box>
        </Button>
      </PopoverTrigger>
      <Tooltip label="Disconnect wallet">
        <Button ml={4} onClick={logoutOfWeb3Modal} variant="outline" size="sm">
          X
        </Button>
      </Tooltip>
      <PopoverContent w={72}>
        <PopoverBody
          as={Flex}
          direction="column"
          px={9}
          py={10}
          _focus={{ background: "none" }}
          _active={{ background: "none" }}
        >
          <Text color={primaryFontColor} fontWeight="bold" textAlign="center" mb={1}>
            Register as a builder
          </Text>
          <Text color={secondaryFontColor} fontSize="sm" fontWeight="normal" textAlign="center" mb={6}>
            Sign a message with your wallet to create a builder profile.
          </Text>
          <Box m="auto" p="px" borderWidth="1px" borderColor={dividerColor} borderRadius={8}>
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
      {isBuilder && (
        <Badge colorScheme="green" mr={4}>
          builder
        </Badge>
      )}
      {isWalletConnected ? userMenu : connectWallet}
    </Flex>
  );
}
