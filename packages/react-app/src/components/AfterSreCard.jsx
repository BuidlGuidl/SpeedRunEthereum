import React from "react";
import { chakra, Button, Center, Image, Flex, Text, Link, Box, VStack } from "@chakra-ui/react";
import useCustomColorModes from "../hooks/useCustomColorModes";

const AfterSreCard = ({ title, description, externalLink, previewImage, backgroundColor, buttonText }) => {
  const { borderColor, bgColor, primaryFontColor } = useCustomColorModes();
  return (
    <Center borderColor={borderColor} bgColor={backgroundColor}>
      <Flex
        justifyContent="space-between"
        maxW={{ base: "7xl", xl: "3xl" }}
        w="100%"
        py={8}
        ml={{ base: 14, xl: 0, "2xl": 14 }}
        mr={{ base: 14, xl: 0, "2xl": 14 }}
        pl={10}
        borderLeft={{ base: "dashed 5px", xl: "none" }}
        borderColor={borderColor}
        borderBottomColor={borderColor}
        position="relative"
        direction={{
          base: "column-reverse",
          lg: "row",
        }}
      >
        <chakra.span
          h={5}
          w={5}
          rounded="full"
          backgroundColor={bgColor}
          border="4px"
          borderColor={borderColor}
          position="absolute"
          top={{
            base: "58%",
            lg: "50%",
          }}
          left="-13px"
          display={{ base: "flex", xl: "none" }}
        />
        <VStack alignItems="start" maxWidth={{ base: "100%", lg: "40%" }} spacing={4}>
          <VStack alignItems="start" spacing={0} mt={{ base: 0, lg: 100 }}>
            <Text fontSize={{ base: "3xl", lg: "2xl" }} color={primaryFontColor} mt={0} fontWeight="bold">
              {title}
            </Text>
          </VStack>
          <VStack alignItems="start" spacing={8}>
            <Text color={primaryFontColor} fontSize={{ base: "lg", lg: "md" }}>
              {description}
            </Text>

            <Button
              as={Link}
              href={externalLink}
              fontSize={{ base: "xl", lg: "lg" }}
              colorScheme="green"
              isExternal
              py="1.25rem"
              px={6}
              textTransform="uppercase"
              textDecoration="none !important"
            >
              {buttonText}
            </Button>
          </VStack>
        </VStack>
        <Box
          d="flex"
          justifyContent="center"
          alignItems="center"
          mb={{
            base: 6,
            lg: 0,
          }}
        >
          <Image
            src={previewImage}
            alt={`${title} image`}
            maxW={{ lg: "400px" }}
            p={previewImage.includes("techTree") ? "36px" : 0}
            mr={{ base: 0, "2xl": "50px" }}
          />
        </Box>
      </Flex>
    </Center>
  );
};

export default AfterSreCard;
