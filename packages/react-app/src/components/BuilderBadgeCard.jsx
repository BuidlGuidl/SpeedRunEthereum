import React, { useState, useEffect } from "react";
import { Flex, Divider, Text, Link, Skeleton, SkeletonText } from "@chakra-ui/react";
import useCustomColorModes from "../hooks/useCustomColorModes";
import axios from "axios";
import { usePoller } from "eth-hooks";

const BuilderBadgeCardSkeleton = ({ isLoaded, children }) => (
  <Skeleton isLoaded={isLoaded}>{isLoaded ? children() : <SkeletonText mt="4" noOfLines={4} spacing="4" />}</Skeleton>
);

// TODO get the actual join date. Should be easy getting the user.create event
const BuilderBadgeCard = ({ builder, readContracts, address }) => {
    const [balance, setBalance] = useState({
      loading: true,
      items: [],
    });

    const { borderColor, secondaryFontColor } = useCustomColorModes();

    const getImageAddress = async ( badge ) => {
      const metadata = await axios.get(`https://ipfs.io/ipfs/QmWWSZAbQNh6ynhAetWAvJkwZjjCybeTSs8zT2DqELsqiK/000000000000000000000000000000000000000000000000000000000000000${badge}.json`);
      return metadata.data
    }
  
  const loadBadges = async () => {
    if (!address || !readContracts) return;
    setBalance({
      loading: true,
      items: [],
    });

    var balances = [];
    
    const userBalance0 = (await readContracts.BuidlBadges.balanceOf(address, "0")).toNumber();
      if (userBalance0 > 0) {
      balances.push(1)
      }
    const userBalance1 = (await readContracts.BuidlBadges.balanceOf(address, "1")).toNumber();
      if (userBalance1 > 0) {
      balances.push(1)
      }
    const userBalance2 = (await readContracts.BuidlBadges.balanceOf(address, "2")).toNumber();
      if (userBalance2 > 1) {
      balances.push(2)
      }
    const userBalance3 = (await readContracts.BuidlBadges.balanceOf(address, "3"));
      if (userBalance3 > 1) {
      balances.push(3)
      }
    const userBalance4 = (await readContracts.BuidlBadges.balanceOf(address, "4"));
      if (userBalance4 > 1) {
      balances.push(4)
      }
    const userBalance5 = (await readContracts.BuidlBadges.balanceOf(address, "5"));
      if (userBalance5 > 1) {
      balances.push(5)
      }
    const userBalance6 = (await readContracts.BuidlBadges.balanceOf(address, "6"));
      if (userBalance6 > 1) {
      balances.push(6)
      }
    const userBalance7 = (await readContracts.BuidlBadges.balanceOf(address, "7"));
      if (userBalance7 > 1) {
      balances.push(7)
      }

    const tokensPromises = [];
    
    for (let i = 0; i < balances; i += 1) {
      tokensPromises.push(getImageAddress(i));
    }

    const tokens = await Promise.all(tokensPromises);
    console.log(tokens)
    console.log(readContracts)
    console.log(address)
    setBalance({
      loading: false,
      items: tokens,
    });
  }

  useEffect(() => {
    if (readContracts) loadBadges();
  }, [address, readContracts]);

  return (
    <BuilderBadgeCardSkeleton isLoaded={!!builder}>
      {() => (
        /* delay execution */
        <Flex
          borderRadius="lg"
          borderColor={borderColor}
          borderWidth={1}
          justify={{ base: "space-around", xl: "center" }}
          direction={{ base: "row", xl: "column" }}
          p={4}
          pb={6}
          maxW={{ base: "full", lg: "50%", xl: 60 }}
          margin="auto"
          >
          <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={8}>Badges:</Text>
          <div style={{ display: "grid", margin: "0 auto" }}>
            <h3 style={{ marginBottom: 25 }}>My collection:</h3>
            {balance.items.length === 0 && <p>Your collection is empty</p>}
            {balance.items.length > 0 &&
              balance.items.map(item => (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                  <img
                    style={{ maxWidth: "150px", display: "block", margin: "0 auto", marginBottom: "20px" }}
                    src={item.image}
                    alt="BuidlBadges"
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
