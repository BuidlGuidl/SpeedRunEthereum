import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link as RouteLink } from "react-router-dom";
import { forwardRef, Button, Box, Flex, Link, Progress, Tag, Td, Tr } from "@chakra-ui/react";
import Address from "./Address";
import { getAcceptedChallenges } from "../helpers/builders";
import EthIcon from "./icons/EthIcon";
import HeroIconBolt from "./icons/HeroIconBolt";
import MoonIcon from "./icons/MoonIcon";
import simpleStreamAbi from "../contracts/simpleStreamAbi.json";
import { userFunctionDescription, USER_ROLES } from "../helpers/constants";
import BlockchainProvidersContext from "../contexts/blockchainProvidersContext";
import useCustomColorModes from "../hooks/useCustomColorModes";

const secondsPerDay = 24 * 60 * 60;

const BuilderRow = forwardRef(({ setUserRole, builder, mainnetProvider }, ref) => {
  const { primaryFontColor, secondaryFontColor } = useCustomColorModes();
  const providerData = useContext(BlockchainProvidersContext).mainnet;
  const provider = providerData.provider;
  const isProviderReady = providerData.isReady;
  const [streamBalance, setStreamBalance] = useState(0);
  const [streamSize, setStreamSize] = useState(0);
  const [streamFrequencyDays, setStreamFrequencyDays] = useState(0);
  const [streamAvailable, setStreamAvailable] = useState(0);
  const builderBuilds = builder?.builds?.length ?? 0;
  const acceptedChallenges = getAcceptedChallenges(builder?.challenges)?.length ?? 0;
  const hasStream = !!builder?.streamContractAddress;
  const builderStreamContractAddress = builder?.streamContractAddress;

  useEffect(() => {
    console.log("stream contract address updated!", builderStreamContractAddress);
    if (!builderStreamContractAddress) {
      return;
    }
    if (!isProviderReady) {
      return;
    }
    const streamContract = new ethers.Contract(builderStreamContractAddress, simpleStreamAbi, provider);
    const readStream = async () => {
      streamContract.frequency().then(frequency => setStreamFrequencyDays(frequency / secondsPerDay));
      provider.getBalance(builderStreamContractAddress).then(balance => {
        const formattedBalance = ethers.utils.formatEther(balance);
        const parsedBalance = parseFloat(formattedBalance);
        setStreamBalance(Number.isNaN(parsedBalance) ? 0 : parsedBalance);
      });
      streamContract.cap().then(size => {
        const formattedSize = ethers.utils.formatEther(size);
        const parsedSize = parseFloat(formattedSize);
        setStreamSize(Number.isNaN(parsedSize) ? 0 : parsedSize);
      });
      streamContract.streamBalance().then(available => {
        const formattedAvailable = ethers.utils.formatEther(available);
        const parsedAvailable = parseFloat(formattedAvailable);
        setStreamAvailable(Number.isNaN(parsedAvailable) ? 0 : parsedAvailable);
      });
    };
    readStream();
  }, [isProviderReady, builderStreamContractAddress, provider]);

  return (
    <Tr color={primaryFontColor}>
      <Td>
        <Link as={RouteLink} to={`/builders/${builder.id}`} pos="relative">
          <Address address={builder.id} ensProvider={mainnetProvider} w="12.5" fontSize="16" />
        </Link>
      </Td>
      <Td isNumeric>{builderBuilds}</Td>
      <Td isNumeric>{acceptedChallenges}</Td>
      <Td isNumeric whiteSpace="nowrap" textAlign="left">
        {!hasStream ? (
          "-"
        ) : (
          <Flex align="center" justify="end">
            <EthIcon w={4} mr={1} />
            {streamBalance?.toFixed(4)}
          </Flex>
        )}
      </Td>
      <Td isNumeric whiteSpace="nowrap">
        {!hasStream ? (
          "-"
        ) : (
          <Flex align="center" justify="end">
            <EthIcon w={4} mr={1} />
            {streamSize.toFixed(4)} / {streamFrequencyDays}d
          </Flex>
        )}
      </Td>
      <Td isNumeric whiteSpace="nowrap">
        {!hasStream ? (
          "-"
        ) : (
          <Flex align="center" justify="end" direction="column">
            <Box mb={1}>
              <Box mb={1}>
                <EthIcon w={4} mr={1} />
                {streamAvailable.toFixed(4)}
              </Box>
              <Box w="full" pl={1}>
                <Progress flexShrink={1} size="xs" value={(streamAvailable / streamSize) * 100} colorScheme="green" />
              </Box>
            </Box>
          </Flex>
        )}
      </Td>
      <Td whiteSpace="nowrap" textAlign="center">
        {builder.function ? (
          <Tag colorScheme={userFunctionDescription[builder?.function].colorScheme} variant="solid">
            {userFunctionDescription[builder?.function].label}
          </Tag>
        ) : (
          "-"
        )}
      </Td>
      <Td>
        <Button variant="outline">
          <HeroIconBolt w={6} h={6} mr={2} color={secondaryFontColor} />
          Fund
        </Button>
        <Button variant="outline" onClick={() => setUserRole(USER_ROLES[builder.id] ?? USER_ROLES.admin)}>
          <MoonIcon w={6} h={6} mr={2} color={secondaryFontColor} />
          +Admin
        </Button>
      </Td>
    </Tr>
  );
});

export default BuilderRow;
