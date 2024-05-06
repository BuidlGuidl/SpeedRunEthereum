import React, { useMemo } from "react";
import { Container, Box, Text, Center, useColorModeValue } from "@chakra-ui/react";
import ChallengeExpandedCard from "../components/ChallengeExpandedCard";
import { challengeInfo } from "../data/challenges";
import useCustomColorModes from "../hooks/useCustomColorModes";
import HeroLogo from "../components/icons/HeroLogo";
import HeroDiamond from "../components/icons/HeroDiamond";

export default function HomeView({ connectedBuilder, userProvider }) {
  const { primaryFontColor, bgColor } = useCustomColorModes();
  const cardBgColor = useColorModeValue("sre.cardBackground", "sreDark.cardBackground");

  const builderAttemptedChallenges = useMemo(() => {
    if (!connectedBuilder?.challenges) {
      return [];
    }

    return Object.fromEntries(
      Object.entries(connectedBuilder.challenges).filter(([_, challengeData]) => challengeData?.status),
    );
  }, [connectedBuilder]);

  return (
    <Box>
      <Box
        bgColor={bgColor}
        bgImg="/assets/home_header_clouds.svg"
        backgroundPosition="top center"
        backgroundRepeat="repeat-x"
        backgroundSize="auto 300px"
      >
        <Container maxW="container.lg" centerContent p="0 20px" mb="45px">
          <Center mb="35px" w="100%">
            <HeroDiamond maxW="45px" height="auto" />
          </Center>

          <Text
            color={primaryFontColor}
            mb="5"
            fontSize={{
              base: "lg",
              lg: "md",
            }}
            textAlign="center"
          >
            Learn how to build on <strong>Ethereum</strong>; the superpowers and the gotchas.
          </Text>

          <Center
            mb={{
              base: "40px",
              lg: "20px",
            }}
            mt="15px"
            w="100%"
          >
            <HeroLogo maxW="600px" height="auto" />
          </Center>

        </Container>
        <Box
          bgImg="/assets/header_platform.svg"
          backgroundRepeat="repeat-x"
          backgroundSize="auto 130px"
          h="130px"
          pos="relative"
        />
      </Box>

      <Box mt="-20px" pt="20px" bgColor={cardBgColor}>
        {Object.entries(challengeInfo).map(([challengeId, challenge], index, { length }) => (
          <ChallengeExpandedCard
            challengeId={challengeId}
            challenge={challenge}
            // Magic number: we don't want to count the Join the BG as a challenge
            challengeIndex={index < 3 ? index : index - 1}
            builderAttemptedChallenges={builderAttemptedChallenges}
            userProvider={userProvider}
            connectedBuilder={connectedBuilder}
            isFirst={index === 0}
            isLast={length - 1 === index}
          />
        ))}
      </Box>
    </Box>
  );
}
