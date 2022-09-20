import React from "react";
import { Box, HStack, Link } from "@chakra-ui/react";
import { GithubFilled, HeartFilled } from "@ant-design/icons";
import useCustomColorModes from "../hooks/useCustomColorModes";

const SiteFooter = () => {
  const { linkColor } = useCustomColorModes();

  return (
    <Box my={10}>
      <HStack justifyContent="center" spacing="10px">
        <HStack alignItems="center" spacing="7px">
          <GithubFilled />{" "}
          <Link color={linkColor} href="https://github.com/moonshotcollective/scaffold-directory" isExternal>
            Fork me
          </Link>
        </HStack>
        <p>|</p>
        <HStack alignItems="center" spacing="5px">
          <HStack alignItems="center">
            <span>Built with</span> <HeartFilled /> <span>at</span>
          </HStack>
          <Link color={linkColor} href="https://buidlguidl.com/" isExternal>
            BuidlGuidl
          </Link>
        </HStack>
      </HStack>
    </Box>
  );
};

export default SiteFooter;
