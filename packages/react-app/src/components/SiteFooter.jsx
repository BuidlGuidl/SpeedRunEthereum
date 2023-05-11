import React from "react";
import { Box, HStack, Link } from "@chakra-ui/react";
import { GithubFilled, HeartFilled } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import useCustomColorModes from "../hooks/useCustomColorModes";

const SiteFooter = () => {
  const { linkColor } = useCustomColorModes();

  return (
    <Box my={5} fontSize="sm">
      <HStack justifyContent="center" spacing="10px">
        <HStack alignItems="center" spacing="7px">
          <GithubFilled />{" "}
          <Link color={linkColor} href="https://github.com/BuidlGuidl/SpeedRunEthereum" isExternal>
            <FormattedMessage id="footer.fork-me" defaultMessage="Fork me" />
          </Link>
        </HStack>
        <p>|</p>
        <HStack alignItems="center" spacing="5px">
          <FormattedMessage
            id="footer.built-with-love-at-buidlguidl"
            defaultMessage="Built with {heartIcon} at <Link>BuidlGuidl</Link>"
            values={{
              heartIcon: (
                <HStack alignItems="center" mx="5px">
                  <HeartFilled />
                </HStack>
              ),
              Link: chunks => (
                <Link color={linkColor} href="https://buidlguidl.com/" isExternal>
                  {chunks}
                </Link>
              ),
            }}
          />
        </HStack>
      </HStack>
    </Box>
  );
};

export default SiteFooter;
