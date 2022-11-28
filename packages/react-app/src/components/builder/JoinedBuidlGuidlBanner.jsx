import React from "react";
import { Button, Center, Flex, Image, Link, Text, VStack, chakra } from "@chakra-ui/react";
import CrossedSwordsIcon from "../icons/CrossedSwordsIcon";

const BG_FRONTEND_URL = "https://buidlguidl.com";

export const JoinedBuidlGuidlBanner = ({ builderAddress }) => {
  return (
    <VStack
      bg="sre.bgBannerBackground"
      bgImg="/assets/bgBanner_castlePlatform.svg"
      backgroundPosition="bottom center"
      backgroundRepeat="repeat-x"
      position="relative"
      overflow="hidden"
      minH={{ base: "20rem", lg: "24rem" }}
      backgroundSize={{ base: "150%", lg: "110%" }}
    >
      <Image
        src="/assets/bgBanner_joinBgClouds.svg"
        position="absolute"
        top={{ base: "18%", lg: "16%" }}
        left={{ base: "2%", lg: "auto" }}
        zIndex={100}
      />
      <VStack alignItems="center" justifyContent="center" spacing={{ base: "1", lg: "2" }} pt="3">
        <Center position="relative" maxW="2xl">
          <Text textAlign="center" fontSize={{ base: "4xl", lg: "5xl" }} color="sre.text" fontWeight="extrabold">
            This builder has upgraded to BuidlGuidl
          </Text>
        </Center>
        <Button
          as={Link}
          href={`${BG_FRONTEND_URL}/builders/${builderAddress}`}
          isExternal
          variant="solid"
          fontSize="sm"
          border="2px"
          backgroundColor="sreDark.default"
          borderColor="sre.default"
          py="1"
        >
          <Flex justifyContent="center" alignItems="center">
            <CrossedSwordsIcon w={5} h={5} />
            <chakra.span color="sre.text" ml={2} fontWeight="medium">
              View their profile on Buidlguidl
            </chakra.span>
          </Flex>
        </Button>
      </VStack>
    </VStack>
  );
};
