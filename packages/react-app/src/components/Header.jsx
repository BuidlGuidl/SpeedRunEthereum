import React from "react";
import { Link } from "react-router-dom";
import { chakra, Box, Center, Flex, HStack, Spacer } from "@chakra-ui/react";
import { Account } from "./index";

export default function Header({
  injectedProvider,
  userRoles,
  userRole,
  address,
  web3Modal,
  mainnetProvider,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  setUserRole,
  blockExplorer,
}) {
  const isSignerProviderConnected =
    injectedProvider && injectedProvider.getSigner && injectedProvider.getSigner()._isSigner;

  return (
    <Flex borderBottom="1px" borderColor="gray.300" mb={10}>
      <Center pl={13} pr={9} py={6}>
        <a href="/">
          <span role="img" aria-label="castle icon">
            🏰
          </span>{" "}
          <strong>BuidlGuidl</strong>
        </a>
      </Center>
      <HStack as="ul" spacing="36px" style={{ listStyle: "none" }}>
        <chakra.li key="/" color="gray.500" _hover={{ color: "gray.700" }}>
          <Link to="/">Home</Link>
        </chakra.li>
        <chakra.li key="/builders" color="gray.500" _hover={{ color: "gray.700" }}>
          <Link to="/builders">Builders</Link>
        </chakra.li>
        {isSignerProviderConnected && (
          <chakra.li key="/my-profile" color="gray.500" _hover={{ color: "gray.700" }}>
            <Link to="/my-profile">My profile</Link>
          </chakra.li>
        )}
        {userRoles.admin === userRole && (
          <chakra.li key="/challenge-review" color="gray.500" _hover={{ color: "gray.700" }}>
            <Link to="/challenge-review">Review Challenges</Link>
          </chakra.li>
        )}
      </HStack>
      <Spacer />
      <Box py={4} px={10}>
        <Account
          connectText="Connect Wallet"
          isWalletConnected={isSignerProviderConnected}
          address={address}
          mainnetProvider={mainnetProvider}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={() => {
            logoutOfWeb3Modal();
            setUserRole(userRoles.anonymous);
          }}
          blockExplorer={blockExplorer}
          isAdmin={userRole === userRoles.admin}
        />
      </Box>
    </Flex>
  );
}
