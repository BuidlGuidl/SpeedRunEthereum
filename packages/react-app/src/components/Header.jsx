import React from "react";
import { NavLink } from "react-router-dom";
import { chakra, useColorModeValue, Box, Flex, HStack, Spacer } from "@chakra-ui/react";
import { Account } from "./index";
import { USER_ROLES } from "../helpers/constants";
import useCustomColorModes from "../hooks/useCustomColorModes";

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
  const { secondaryFontColor, borderColor } = useCustomColorModes();
  const primaryColorString = useColorModeValue("var(--chakra-colors-gray-700)", "var(--chakra-colors-gray-200)");
  const isSignerProviderConnected =
    injectedProvider && injectedProvider.getSigner && injectedProvider.getSigner()._isSigner;

  return (
    <Box borderBottom="1px" borderColor={borderColor} mb={10} px={8} h={20}>
      <Flex align="center" h="full" fontWeight="semibold">
        <HStack as="ul" spacing={9} style={{ listStyle: "none" }}>
          <chakra.li key="/">
            <NavLink to="/" exact>
              <span role="img" aria-label="castle icon">
                🏃‍♀️
              </span>{" "}
              <strong>Speed Run Ethereum</strong>
            </NavLink>
          </chakra.li>
          {USER_ROLES.anonymous !== userRole && (
            <chakra.li key="/portfolio" color={secondaryFontColor} _hover={{ color: primaryColorString }}>
              <NavLink
                to="/portfolio"
                isActive={(match, location) => location.pathname.includes("/builders/")}
                activeStyle={{
                  color: primaryColorString,
                }}
              >
                Portfolio
              </NavLink>
            </chakra.li>
          )}
          {/* ToDo. At least Builder */}
          {(USER_ROLES.builder === userRole || USER_ROLES.admin === userRole) && (
            <>
              <chakra.li key="/builders" color={secondaryFontColor} _hover={{ color: primaryColorString }}>
                <NavLink
                  to="/builders"
                  exact
                  activeStyle={{
                    color: primaryColorString,
                  }}
                >
                  Builders
                </NavLink>
              </chakra.li>
              <chakra.li key="/builds" color={secondaryFontColor} _hover={{ color: primaryColorString }}>
                <NavLink
                  to="/builds"
                  exact
                  activeStyle={{
                    color: primaryColorString,
                  }}
                >
                  Builds
                </NavLink>
              </chakra.li>
            </>
          )}
          {USER_ROLES.admin === userRole && (
            <chakra.li key="/submission-review" color={secondaryFontColor} _hover={{ color: primaryColorString }}>
              <NavLink
                to="/submission-review"
                exact
                activeStyle={{
                  color: primaryColorString,
                }}
              >
                Review Submissions
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
            setUserRole(null);
          }}
          setUserRole={setUserRole}
          userProvider={userProvider}
          userRole={userRole}
        />
      </Flex>
    </Box>
  );
}
