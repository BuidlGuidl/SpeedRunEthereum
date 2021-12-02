import React, { useState, useEffect } from "react";
import { Image, Link, Flex, Tooltip, Skeleton, HStack } from "@chakra-ui/react";
import axios from "axios";
import useCustomColorModes from "../hooks/useCustomColorModes";

const BuilderBadgeCardSkeleton = () => (
  <HStack>
    <Skeleton h="60px" w="60px" />
    <Skeleton h="60px" w="60px" />
  </HStack>
);

const BadgeContents = ({ isLoading, badges }) => {
  if (isLoading) {
    return <BuilderBadgeCardSkeleton />;
  }

  if (badges.length === 0) {
    return <p>User has no badges yet!</p>;
  }

  return badges.map(item => (
    <Tooltip label={item.name} key={item.name}>
      <Link href={item.image} isExternal>
        <Image d="inline-block" alt="Badge icon" maxW="60px" src={item.tiny} />
      </Link>
    </Tooltip>
  ));
};

const BuilderBadgeCard = ({ readContracts, builderAddress }) => {
  const [balance, setBalance] = useState({
    loading: true,
    items: [],
  });

  const { borderColor } = useCustomColorModes();

  const getTokenMetaData = async badges => {
    const metadata = await axios.get(
      `https://forgottenbots.mypinata.cloud/ipfs/QmZesNT9tbpaNoy727fYRa7cB936dznKqFtZwNwUSbxJBg/000000000000000000000000000000000000000000000000000000000000000${badges}.json`,
    );
    return metadata.data;
  };

  useEffect(() => {
    const loadBadges = async () => {
      if (!builderAddress || !readContracts) return;
      setBalance({
        loading: true,
        items: [],
      });

      const tokensPromises = [];

      const userBalance = await readContracts.BuidlBadges.getUserBadges(builderAddress);
      console.log(userBalance);
      if (userBalance.length) {
        for (let i = 0; i < userBalance.length; i += 1) {
          tokensPromises.push(getTokenMetaData(userBalance[i]));
        }
      }

      const tokens = await Promise.all(tokensPromises);
      setBalance({
        loading: false,
        items: tokens,
      });
    };

    if (readContracts) loadBadges();
  }, [builderAddress, readContracts]);

  return (
    <Flex
      borderRadius="lg"
      borderColor={borderColor}
      borderWidth={1}
      justify="center"
      maxW={{ base: "full", lg: "50%", xl: 60 }}
      margin="8px auto 0"
      px={2}
      py={4}
      style={{
        flexWrap: "wrap",
      }}
    >
      <BadgeContents isLoading={balance.loading} badges={balance.items} />
    </Flex>
  );
};

export default BuilderBadgeCard;
