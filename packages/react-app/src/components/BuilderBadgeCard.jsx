import React, { useState, useEffect } from "react";
import { Flex, Skeleton, SkeletonText } from "@chakra-ui/react";
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
        const userBalance = (await readContracts.BuidlBadges.balanceOf(builderAddress, i)).toNumber();
        // console.log(userBalance)
        if (userBalance > 0) {
          balances.push(i);
          console.log(balances);
        }
      }

      const tokensPromises = [];

      for (let i = 0; i < balances.length; i += 1) {
        tokensPromises.push(getImageAddress(balances[i]));
      }

      const tokens = await Promise.all(tokensPromises);
      console.log(tokens);
      console.log(readContracts);
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
          borderWidth={4}
          justify={{ base: "space-around", xl: "center" }}
          direction={{ base: "row", xl: "column" }}
          p={4}
          pb={6}
          maxW={{ base: "full", lg: "50%", xl: 60 }}
          margin="auto"
        >
          {/* <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={8}>Badges:</Text> */}
          <div
            style={{
              margin: "0 auto",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {balance.loading && <p>Loading Badges</p>}
            {!balance.loading && balance.items.length === 0 && <p>User has no badges yet!</p>}
            {balance.items.length > 0 &&
              balance.items.map(item => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                  }}
                >
                  <img
                    alt="Badge icon"
                    style={{
                      maxWidth: "80px",
                      display: "block",
                      margin: "0 auto",
                      marginRight: "20px",
                      marginTop: "10px",
                      borderRadius: "10px",
                    }}
                    src={item.tiny}
                  />
                </div>
              ))}
          </div>
        </Flex>
      )}
    </BuilderBadgeCardSkeleton>
  );
};

export default BuilderBadgeCard;
