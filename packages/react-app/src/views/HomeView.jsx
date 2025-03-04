import React, { useMemo } from "react";
import { Container, Box, Text, Center, useColorModeValue, Button, Flex } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import ChallengeExpandedCard from "../components/ChallengeExpandedCard";
import { challengeInfo } from "../data/challenges";
import useCustomColorModes from "../hooks/useCustomColorModes";
import HeroLogo from "../components/icons/HeroLogo";
import HeroDiamond from "../components/icons/HeroDiamond";
import AfterSreCard from "../components/AfterSreCard";
import AfterSreLine from "../components/AfterSreLine";

export default function HomeView({ connectedBuilder, userProvider }) {
  const history = useHistory();
  const { primaryFontColor, bgColor } = useCustomColorModes();
  const cardBgColor = useColorModeValue("sre.cardBackground", "sreDark.cardBackground");
  const techTreeBgColor = useColorModeValue("#96EAEA", "#3AACAD");

  const builderAttemptedChallenges = useMemo(() => {
    if (!connectedBuilder?.challenges) {
      return [];
    }

    return Object.fromEntries(
      // eslint-disable-next-line no-unused-vars
      Object.entries(connectedBuilder.challenges).filter(([_, challengeData]) => challengeData?.status),
    );
  }, [connectedBuilder]);

  const handleCtaClick = () => {
    if (window.plausible) {
      window.plausible("cta");
    }

    setTimeout(() => {
      history.push(`/challenge/${Object.keys(challengeInfo)[0]}`);
    }, 100);
  };

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
          <Button onClick={handleCtaClick} colorScheme="green" mt={4} size="lg">
            Start Building on Ethereum
          </Button>
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
            challengeIndex={index < 5 ? index : index - 1}
            builderAttemptedChallenges={builderAttemptedChallenges}
            userProvider={userProvider}
            connectedBuilder={connectedBuilder}
            isFirst={index === 0}
            isLast={length - 1 === index}
          />
        ))}
      </Box>

      <Box
        display="flex"
        flexDirection={{ base: "column", xl: "row" }}
        justifyContent="center"
        bgColor={cardBgColor}
        mx="auto"
        position="relative"
      >
        <AfterSreLine />
        <Flex display={{ base: "none", xl: "flex" }} flexGrow={1} bgColor={techTreeBgColor} />
        <AfterSreCard
          title="ETH Tech Tree"
          description="Check this advanced Solidity challenges to test your Ethereum dev skills."
          externalLink="https://github.com/BuidlGuidl/eth-tech-tree"
          buttonText="Join"
          previewImage="/assets/challenges/techTree.svg"
          backgroundColor={techTreeBgColor}
        />
        <AfterSreCard
          title="Capture the Flag"
          description="Join our CTF game and hack your way through 12 Smart Contract challenges."
          externalLink="https://ctf.buidlguidl.com"
          buttonText="Start"
          previewImage="/assets/challenges/ctf.svg"
          backgroundColor={bgColor}
        />
        <Flex display={{ base: "none", xl: "flex" }} flexGrow={1} bgColor={bgColor} />
      </Box>
    </Box>
  );
}
