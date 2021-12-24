import React from "react";
import { Box, Link, Tooltip, useClipboard } from "@chakra-ui/react";
import { socials } from "../data/socials";

const SocialLink = ({ id, value }) => {
  const Icon = socials[id].icon;
  const { hasCopied, onCopy } = useClipboard(value);
  const link = socials[id].getLink(value);

  return (
    <>
      {link ? (
        <Link href={socials[id].getLink(value)} isExternal>
          <Icon w={4} />
        </Link>
      ) : (
        <Tooltip label="Copied to your clipboard!" isOpen={hasCopied}>
          <Box cursor="pointer" onClick={onCopy}>
            <Icon w={4} label={value} />
          </Box>
        </Tooltip>
      )}
    </>
  );
};

export default SocialLink;
