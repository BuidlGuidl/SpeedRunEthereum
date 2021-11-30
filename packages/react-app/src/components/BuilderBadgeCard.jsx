import React, { useState, useEffect } from "react";
import { Spinner, Image, Flex, Skeleton, SkeletonText } from "@chakra-ui/react";
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

  const getTokenMetaData = async badges => {
    //const parsed = parseInt(badges, 10);
    const metadata = await axios.get(
      `https://forgottenbots.mypinata.cloud/ipfs/QmZesNT9tbpaNoy727fYRa7cB936dznKqFtZwNwUSbxJBg/000000000000000000000000000000000000000000000000000000000000000${badges}.json`,
    );
    //tokenDatas.push(metadata.data);
    return metadata.data;
  };

  const loadBadges = async () => {
    if (!builderAddress || !readContracts) return;
    setBalance({
      loading: true,
      items: [],
    });

    const tokensPromises = [];

    let userBalance = await readContracts.BuidlBadges.getUserBadges(builderAddress);
    console.log(userBalance);
    if (userBalance.length) {
      for (let i = 0; i < userBalance.length; i += 1) {
        tokensPromises.push(getTokenMetaData(userBalance[i]));
      }
    }

    const tokens = await Promise.all(tokensPromises);
    console.log(tokens);
    console.log(readContracts);
    //console.log(address)
    setBalance({
      loading: false,
      items: tokens,
    });
  };

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
          {balance.loading && <Spinner />}
          {!balance.loading && balance.items.length === 0 && <p>User has no badges yet!</p>}
          {balance.items.length > 0 &&
            balance.items.map(item => (
              <a href={item.image}>
                <Image d="inline-block" alt="Badge icon" maxW="60px" src={item.tiny} />
              </a>
            ))}
        </Flex>
      )}
    </BuilderBadgeCardSkeleton>
  );
};

export default BuilderBadgeCard;
