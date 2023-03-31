import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { chakra, useColorModeValue, Box, Flex, HStack, Spacer } from "@chakra-ui/react";
import { Account } from "./index";
import { USER_ROLES } from "../helpers/constants";
import { ENVIRONMENT } from "../constants";
import useCustomColorModes from "../hooks/useCustomColorModes";
import HeaderLogo from "./icons/HeaderLogo";

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
  const { linkColor, bgColor } = useCustomColorModes();
  const primaryColorString = useColorModeValue("var(--chakra-colors-gray-700)", "var(--chakra-colors-gray-200)");
  const location = useLocation();

  const isSignerProviderConnected =
    injectedProvider && injectedProvider.getSigner && injectedProvider.getSigner()._isSigner;
  const userIsRegistered = userRole && USER_ROLES.anonymous !== userRole;

  const isHomepage = location.pathname === "/";

  return (
    <Box
      borderBottom={isHomepage ? 0 : "1px"}
      borderColor="#088484"
      backgroundColor={bgColor}
      px={{ base: 4, lg: 8 }}
      h={{ base: userIsRegistered ? "120px" : "80px", lg: "80px" }}
    >
      {ENVIRONMENT !== "production" && (
        <Box
          color="blackAlpha.500"
          pos="fixed"
          p="2px"
          fontSize={14}
          w="100%"
          bgColor="yellow.200"
          left={0}
          textAlign="center"
          zIndex="10"
        >
          Working on a {ENVIRONMENT} environment.
        </Box>
      )}
      <Flex
        align={{ base: userIsRegistered ? "start" : "center", lg: "center" }}
        h="full"
        fontWeight="bold"
        pos="relative"
      >
        {!isHomepage && (
          <Flex shrink={0} mr={9} mt={{ base: userIsRegistered ? 4 : 0, lg: 0 }}>
            <NavLink to="/" exact>
              <HeaderLogo maxW="205px" height="auto" />
            </NavLink>
          </Flex>
        )}
        <HStack
          as="ul"
          mr={{ base: 0, lg: 6 }}
          mt={{ base: "7px", lg: 0 }}
          style={{ listStyle: "none" }}
          spacing={{ base: 6, lg: 9 }}
          pos={{ base: "absolute", lg: "static" }}
          justifyContent={{ base: "center", lg: "left" }}
          top="80px"
          left={0}
        >
          {userRole && USER_ROLES.anonymous !== userRole && (
            <chakra.li key="/portfolio" color={linkColor} _hover={{ color: primaryColorString }}>
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
              <chakra.li key="/builders" color={linkColor} _hover={{ color: primaryColorString }}>
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
            </>
          )}
          {USER_ROLES.admin === userRole && (
            <>
              <chakra.li key="/submission-review" color={linkColor} _hover={{ color: primaryColorString }}>
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
              <chakra.li key="/activity" color={linkColor} _hover={{ color: primaryColorString }}>
                <NavLink
                  to="/activity"
                  exact
                  activeStyle={{
                    color: primaryColorString,
                  }}
                >
                  Activity
                </NavLink>
              </chakra.li>
            </>
          )}
        </HStack>
        <Spacer />
        <Box mt={{ base: userIsRegistered ? 3 : 0, lg: 0 }}>
          <Account
            address={address}
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
