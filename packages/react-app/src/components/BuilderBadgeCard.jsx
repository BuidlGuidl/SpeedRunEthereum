import React, { useState, useEffect } from "react";
import { Flex, Spinner, Skeleton, SkeletonText, Image } from "@chakra-ui/react";
import axios from "axios";
import useCustomColorModes from "../hooks/useCustomColorModes";

const BuilderBadgeCardSkeleton = ({ isLoaded, children }) => (
  <Skeleton isLoaded={isLoaded}>{isLoaded ? children() : <SkeletonText mt="4" noOfLines={4} spacing="4" />}</Skeleton>
);

const BuilderBadgeCard = ({ builder, readContracts, builderAddress }) => {
  const [balance, setBalance] = useState({
    loading: true,
    items: [],
  });

  const { borderColor } = useCustomColorModes();

  const getImageAddress = async badge => {
    const metadata = await axios.get(
      `https://forgottenbots.mypinata.cloud/ipfs/QmZesNT9tbpaNoy727fYRa7cB936dznKqFtZwNwUSbxJBg/000000000000000000000000000000000000000000000000000000000000000${badge}.json`,
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

      const balances = [];

      for (let i = 0; i < 10; i += 1) {
        const userBalance = await readContracts.BuidlBadges.balanceOf(builderAddress, i);
        if (userBalance.gt(0)) {
          balances.push(i);
          console.log(balances);
        }
      }

      const tokensPromises = [];

      for (let i = 0; i < balances.length; i += 1) {
        tokensPromises.push(getImageAddress(balances[i]));
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
    <BuilderBadgeCardSkeleton isLoaded={!!builder}>
      {() => (
        /* delay execution */
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
            flexWrap: "wrap"
          }}
        >
          {balance.loading && <Spinner />}
          {!balance.loading && balance.items.length === 0 && <p>User has no badges yet!</p>}
          {balance.items.length > 0 &&
            balance.items.map(item => <Image d="inline-block" alt="Badge icon" maxW="60px" src={item.tiny} />)}
        </Flex>
      )}
    </BuilderBadgeCardSkeleton>
  );
};

export default BuilderBadgeCard;
