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
    <Box borderBottom="1px" borderColor={borderColor} mb={10} px={{ base: 4, lg: 8 }} h={{ base: "120px", lg: "80px" }}>
      <Flex align={{ base: "start", lg: "center" }} h="full" fontWeight="semibold" pos="relative">
        <Flex shrink={0} mr={9} mt={{ base: 5, lg: 0 }}>
          <NavLink to="/" exact>
            <span role="img" aria-label="castle icon">
              🏃‍♀️
            </span>{" "}
            <chakra.strong display={{ base: "none", md: "inline-block" }}>Speed Run Ethereum</chakra.strong>
            <chakra.strong display={{ base: "inline-block", md: "none" }}>SRE</chakra.strong>
          </NavLink>
        </Flex>
        <HStack
          as="ul"
          mr={{ base: 0, lg: 6 }}
          style={{ listStyle: "none" }}
          spacing={{ base: 6, lg: 9 }}
          pos={{ base: "absolute", lg: "static" }}
          justifyContent={{ base: "center", lg: "left" }}
          top="80px"
          left={0}
        >
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
        <Box mt={{ base: 3, lg: 0 }}>
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
        </Box>
      </Flex>
    </Box>
  );
}
