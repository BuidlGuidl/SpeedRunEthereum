import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useToast, useColorModeValue, Container, SimpleGrid, GridItem, Box } from "@chakra-ui/react";
import BuilderProfileCard from "../components/builder/BuilderProfileCard";
import { challengeInfo } from "../data/challenges";
import { BG_BACKEND_URL as bgBackendUrl } from "../constants";
import { getAcceptedChallenges } from "../helpers/builders";
import { getChallengeEventsForUser } from "../data/api";
import { byTimestamp } from "../helpers/sorting";
import { JoinedBuidlGuidlBanner } from "../components/builder/JoinedBuidlGuidlBanner";
import { BuilderProfileHeader } from "../components/builder/BuilderProfileHeader";
import { BuilderChallenges } from "../components/builder/BuilderChallenges";

export default function BuilderProfileView({
  serverUrl,
  mainnetProvider,
  address,
  userProvider,
  userRole,
  fetchUserData,
}) {
  const { builderAddress } = useParams();
  const [builder, setBuilder] = useState();
  const [challengeEvents, setChallengeEvents] = useState([]);
  const [isLoadingBuilder, setIsLoadingBuilder] = useState(false);
  const [isBuilderOnBg, setIsBuilderOnBg] = useState(false);
  const [isLoadingTimestamps, setIsLoadingTimestamps] = useState(false);
  const toast = useToast({ position: "top", isClosable: true });
  const toastVariant = useColorModeValue("subtle", "solid");
  const bgColor = useColorModeValue("sre.cardBackground", "sreDark.cardBackground");
  let challenges = builder?.challenges ? Object.entries(builder.challenges) : undefined;
  if (challenges) {
    challenges = challenges.sort((a, b) => {
      const [aChallenge] = a;
      const [bChallenge] = b;
      return challengeInfo[aChallenge].id > challengeInfo[bChallenge].id ? 1 : -1;
    });
  }
  const acceptedChallenges = getAcceptedChallenges(builder?.challenges);
  const isMyProfile = builderAddress === address;

  const fetchBuilder = async () => {
    setIsLoadingBuilder(true);
    const fetchedBuilder = await axios.get(serverUrl + `/builders/${builderAddress}`);
    setBuilder(fetchedBuilder.data);

    try {
      await axios.get(bgBackendUrl + `/builders/${builderAddress}`);
    } catch (e) {
      // Builder Not found in BG
      setIsLoadingBuilder(false);
      return;
    }

    setIsBuilderOnBg(true);
    setIsLoadingBuilder(false);
  };

  useEffect(() => {
    fetchBuilder();
    // eslint-disable-next-line
  }, [builderAddress]);

  useEffect(() => {
    if (!builderAddress) {
      return;
    }

    async function fetchChallengeEvents() {
      setIsLoadingTimestamps(true);
      try {
        const fetchedChallengeEvents = await getChallengeEventsForUser(builderAddress);
        setChallengeEvents(fetchedChallengeEvents.sort(byTimestamp).reverse());
        setIsLoadingTimestamps(false);
      } catch (error) {
        toast({
          description: "Can't get challenges metadata. Please try again",
          status: "error",
          variant: toastVariant,
        });
      }
    }
    fetchChallengeEvents();
    // eslint-disable-next-line
  }, [builderAddress]);

  return (
    <Box bgColor={bgColor} py={10}>
      <Container maxW="container.xl">
        <SimpleGrid gap={14} columns={{ base: 1, xl: 4 }}>
          <GridItem colSpan={1}>
            <BuilderProfileCard
              builder={builder}
              mainnetProvider={mainnetProvider}
              isMyProfile={isMyProfile}
              userProvider={userProvider}
              fetchBuilder={() => {
                fetchBuilder();
                fetchUserData();
              }}
              userRole={userRole}
            />
          </GridItem>
          <GridItem colSpan={{ base: 1, xl: 3 }}>
            {isBuilderOnBg && <JoinedBuidlGuidlBanner builderAddress={builderAddress} />}
            <BuilderProfileHeader acceptedChallenges={acceptedChallenges} builder={builder} />
            <BuilderChallenges
              challenges={challenges}
              challengeEvents={challengeEvents}
              isMyProfile={isMyProfile}
              isLoadingBuilder={isLoadingBuilder}
              isLoadingTimestamps={isLoadingTimestamps}
            />
          </GridItem>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
