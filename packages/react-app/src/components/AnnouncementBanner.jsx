import React from "react";
import { chakra, useColorModeValue, Link } from "@chakra-ui/react";

export default function AnnouncementBanner() {
  const bannerBg = useColorModeValue("#fbf7f6", "whiteAlpha.300");

  return (
    <chakra.div textAlign="center" padding="20px" bgColor={bannerBg}>
      Hey builder!! The BuidlGuidl is hosting a{" "}
      <Link href="https://hackathon.buidlguidl.com/" fontWeight="700" color="teal.500" isExternal>
        🏗 Scaffold-Eth 2 hackathon
      </Link>
      . We are giving 10 ETH away to the best projects.
      <br /> Come join the fun and learn the latest scaffold-eth techniques! Let's build a bunch of apps!
    </chakra.div>
  );
}
