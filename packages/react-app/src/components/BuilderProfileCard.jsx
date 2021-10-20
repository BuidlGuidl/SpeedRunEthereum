import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { Flex, Divider, Text, Link, Skeleton, SkeletonText } from "@chakra-ui/react";
import QRPunkBlockie from "./QrPunkBlockie";
import { getIconForProfileLinkType } from "../helpers/socialIcons";
import useDisplayAddress from "../hooks/useDisplayAddress";
import { ellipsizedAddress } from "../helpers/strings";

const BuilderProfileCardSkeleton = ({ isLoaded, children }) => (
  <Skeleton isLoaded={isLoaded}>{isLoaded ? children() : <SkeletonText mt="4" noOfLines={4} spacing="4" />}</Skeleton>
);

// TODO get the actual join date. Should be easy getting the user.create event
const BuilderProfileCard = ({ builder, mainnetProvider }) => {
  const ens = useDisplayAddress(mainnetProvider, builder?.id);
  const shortAddress = ellipsizedAddress(builder?.id);
  const hasEns = ens !== shortAddress;

  // INFO: conditional chaining and coalescing didn't work when also checking the length
  const hasProfileLinks = builder?.profileLinks ? builder.profileLinks.length !== 0 : false;

  return (
    <Flex borderRadius="lg" borderColor="gray.200" borderWidth={1} justify="center" p={4} pb={6} maxW={60}>
      <BuilderProfileCardSkeleton isLoaded={!!builder}>
        {() => (
          /* delay execution */
          <>
            <Link as={RouteLink} to={`/builders/${builder.id}`}>
              <QRPunkBlockie withQr={false} address={builder.id?.toLowerCase()} w={52} borderRadius="lg" />
            </Link>
            <Flex alignContent="center" direction="column" mt={4}>
              {hasEns ? (
                <>
                  <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                    {ens}
                  </Text>
                  <Text textAlign="center" mb={8} color="gray.600">
                    {shortAddress}
                  </Text>
                </>
              ) : (
                <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={8}>
                  {shortAddress}
                </Text>
              )}
              <Divider mb={6} />
              {hasProfileLinks && (
                <Flex mb={4} justifyContent="space-evenly" alignItems="center">
                  {builder.profileLinks?.map(({ type, url }) => {
                    const Icon = getIconForProfileLinkType(type);
                    return (
                      <Link href={url}>
                        <Icon />
                      </Link>
                    );
                  })}
                </Flex>
              )}
              <Text textAlign="center" color="gray.600">
                Joined September 2021
              </Text>
            </Flex>
          </>
        )}
      </BuilderProfileCardSkeleton>
    </Flex>
  );
};

export default BuilderProfileCard;
