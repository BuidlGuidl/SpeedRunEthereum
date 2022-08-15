import React from "react";
import { Flex, HStack, Tag, Text } from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { userFunctionDescription } from "../../helpers/constants";
import useCustomColorModes from "../../hooks/useCustomColorModes";

export const BuilderProfileHeader = ({ acceptedChallenges, builder }) => {
  const { secondaryFontColor, borderColor, iconBgColor } = useCustomColorModes();

  return (
    <HStack spacing={4} mb={8}>
      <Flex borderRadius="lg" borderColor={borderColor} borderWidth={1} p={4} w="full" justify="space-between">
        <Flex bg={iconBgColor} borderRadius="lg" w={12} h={12} justify="center" align="center">
          <InfoOutlineIcon w={5} h={5} />
        </Flex>
        <div>
          <Text fontSize="xl" fontWeight="medium" textAlign="right">
            {acceptedChallenges.length}
          </Text>
          <Text fontSize="sm" color={secondaryFontColor} textAlign="right">
            challenges completed
          </Text>
        </div>
      </Flex>
      <Flex borderRadius="lg" borderColor={borderColor} borderWidth={1} p={4} w="full" justify="space-between">
        <Flex bg={iconBgColor} borderRadius="lg" w={12} h={12} justify="center" align="center">
          <InfoOutlineIcon w={5} h={5} />
        </Flex>
        <div>
          <Text fontSize="xl" fontWeight="medium" textAlign="right">
            {builder?.function ? (
              <Tag colorScheme={userFunctionDescription[builder?.function].colorScheme} variant="solid">
                {userFunctionDescription[builder?.function].label}
              </Tag>
            ) : (
              "-"
            )}
          </Text>
          <Text fontSize="sm" color={secondaryFontColor} textAlign="right">
            Role
          </Text>
        </div>
      </Flex>
    </HStack>
  );
};
