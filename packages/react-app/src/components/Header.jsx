import React from "react";
import { NavLink } from "react-router-dom";
import { chakra, Box, Flex, HStack, Spacer } from "@chakra-ui/react";
import { Account } from "./index";
import { USER_ROLES } from "../helpers/constants";

export default function Header({
  injectedProvider,
  userRole,
  address,
  mainnetProvider,
  userProvider,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  setUserRole,
}) {
  const isSignerProviderConnected =
    injectedProvider && injectedProvider.getSigner && injectedProvider.getSigner()._isSigner;

  return (
    <Box borderBottom="1px" borderColor="gray.200" mb={10} px={8} h={20}>
      <Flex align="center" h="full" fontWeight="semibold">
        <HStack as="ul" spacing={9} style={{ listStyle: "none" }}>
          <chakra.li key="/">
            <NavLink to="/" exact>
              <span role="img" aria-label="castle icon">
                🏰
              </span>{" "}
              <strong>BuidlGuidl</strong>
            </NavLink>
          </chakra.li>
          <chakra.li key="/builders" color="gray.600" _hover={{ color: "gray.700" }}>
            <NavLink
              to="/builders"
              exact
              activeStyle={{
                color: "var(--chakra-colors-gray-700)",
              }}
            >
              Builders
            </NavLink>
          </chakra.li>
          {USER_ROLES.admin === userRole && (
            <chakra.li key="/challenge-review" color="gray.600" _hover={{ color: "gray.700" }}>
              <NavLink
                to="/challenge-review"
                exact
                activeStyle={{
                  color: "var(--chakra-colors-gray-700)",
                }}
              >
                Review Challenges
              </NavLink>
            </chakra.li>
          )}
        </HStack>
        <Spacer />
        <Account
          address={address}
          connectText="Connect Wallet"
          ensProvider={mainnetProvider}
          isWalletConnected={isSignerProviderConnected}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={() => {
            logoutOfWeb3Modal();
            setUserRole(USER_ROLES.anonymous);
          }}
          setUserRole={setUserRole}
          userProvider={userProvider}
          userRole={userRole}
        />
      </Flex>
    </Box>
  );
}
