import React, { useState, useEffect } from "react";
import { Flex, Skeleton, SkeletonText } from "@chakra-ui/react";
import useCustomColorModes from "../hooks/useCustomColorModes";
import axios from "axios";

const BuilderBadgeCardSkeleton = ({ isLoaded, children }) => (
  <Skeleton isLoaded={isLoaded}>{isLoaded ? children() : <SkeletonText mt="4" noOfLines={4} spacing="4" />}</Skeleton>
);

// TODO get the actual join date. Should be easy getting the user.create event
const BuilderBadgeCard = ({ builder, readContracts, builderAddress }) => {
    const [balance, setBalance] = useState({
      loading: true,
      items: [],
    });

    const { borderColor, secondaryFontColor } = useCustomColorModes();

    const getImageAddress = async ( badge ) => {
      const metadata = await axios.get(`https://ipfs.io/ipfs/QmSCkywYcmTn9A8mmPmRAbBuWrVjBDvq9FHeV7vmY9hymz/000000000000000000000000000000000000000000000000000000000000000${badge}.json`);
      return metadata.data
    }
  
  const loadBadges = async () => {
    if (!builderAddress || !readContracts) return;
    setBalance({
      loading: true,
      items: [],
    });

    var balances = [];

    for (let i = 0; i < 10; i += 1) {
      let userBalance = (await readContracts.BuidlBadges.balanceOf(builderAddress, i)).toNumber();
      //console.log(userBalance)
      if (userBalance > 0) {
      balances.push(i)
      console.log(balances)
      }
    }

    const tokensPromises = [];
    
    for (let i = 0; i < balances.length; i += 1) {
      tokensPromises.push(getImageAddress(balances[i]));
    }

    const tokens = await Promise.all(tokensPromises);
    console.log(tokens)
    console.log(readContracts)
    //console.log(address)
    setBalance({
      loading: false,
      items: tokens,
    });
  }

  useEffect(() => {
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
          <div style={{ display: "grid", margin: "0 auto", display:"flex", flexDirection:"row", flexWrap: "wrap", justifyContent: "center" }}>
          {balance.loading == true && <p>Loading Badges</p>}
            {balance.loading == false && balance.items.length == 0 && <p>User has no badges yet!</p>}
            {balance.items.length > 0 &&
              balance.items.map(item => (
                <div style={{ display: "flex", flexDirection:"row", flexWrap: "wrap", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                  <img
                    style={{ maxWidth: "80px", display: "block", margin: "0 auto", marginRight: "20px", marginTop: "10px", borderRadius: "10px" }}
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
