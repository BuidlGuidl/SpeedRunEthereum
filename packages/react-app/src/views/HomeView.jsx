import React, { useMemo } from "react";
import { Container, Box, Text, Center } from "@chakra-ui/react";
import ChallengeExpandedCard from "../components/ChallengeExpandedCard";
import { challengeInfo } from "../data/challenges";
import useCustomColorModes from "../hooks/useCustomColorModes";

export default function HomeView({ connectedBuilder, userProvider }) {
  const { primaryFontColor, bgColor } = useCustomColorModes();

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
      <Box bgColor={bgColor}>
        <Container maxW="container.lg" centerContent p="32px">
          <Center mb="15px">
            <img src="/assets/home_header_diamond.svg" alt="SRE Home diamond" />
          </Center>

          <Text color={primaryFontColor} mb="6" fontSize="lg" textAlign="center">
            <span role="img" aria-label="teacher icon">
              👩‍🏫
            </span>{" "}
            Learn how to build on <strong>Ethereum</strong>; the superpowers and the gotchas.
          </Text>

          <Center mb="40px" mt="15px">
            <img src="/assets/home_header_logo.svg" alt="SRE Home logo" />
          </Center>

          <Text color={primaryFontColor} mb="6" fontSize="lg" textAlign="center">
            <span role="img" aria-label="teacher icon">
              🎥
            </span>{" "}
            Watch this quick video as an{" "}
            <a
              href="https://www.youtube.com/watch?v=MlJPjJQZtC8"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline" }}
            >
              Intro to Ethereum Development
            </a>
            .
          </Text>

          <Text color={primaryFontColor} mb="2" fontSize="lg" textAlign="center">
            Then use{" "}
            <a
              style={{ textDecoration: "underline" }}
              href="https://github.com/scaffold-eth/scaffold-eth#-scaffold-eth"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span role="img" aria-label="teacher icon">
                🏗
              </span>{" "}
              Scaffold-ETH
            </a>{" "}
            to copy/paste each Solidity concept and tinker:
          </Text>

          <Text color={primaryFontColor} mb="8" fontSize="lg" textAlign="center">
            <div>
              <a
                href="https://docs.soliditylang.org/en/v0.6.6/units-and-global-variables.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                global units
              </a>
              ,{" "}
              <a target="_blank" href="https://solidity-by-example.org/primitives/" rel="noopener noreferrer">
                primitives
              </a>
              ,{" "}
              <a target="_blank" href="https://solidity-by-example.org/mapping/" rel="noopener noreferrer">
                mappings
              </a>
              ,{" "}
              <a href="https://solidity-by-example.org/structs/" target="_blank" rel="noopener noreferrer">
                structs
              </a>
              ,{" "}
              <a href="https://solidity-by-example.org/function-modifier/" target="_blank" rel="noopener noreferrer">
                modifiers
              </a>
              ,{" "}
              <a href="https://solidity-by-example.org/events/" target="_blank" rel="noopener noreferrer">
                events
              </a>
              ,
            </div>{" "}
            <a href="https://solidity-by-example.org/inheritance/" target="_blank" rel="noopener noreferrer">
              inheritance
            </a>
            ,{" "}
            <a href="https://solidity-by-example.org/sending-ether/" target="_blank" rel="noopener noreferrer">
              sending eth
            </a>
            , and{" "}
            <a href="https://solidity-by-example.org/payable/" target="_blank" rel="noopener noreferrer">
              payable
            </a>
            /
            <a href="https://solidity-by-example.org/fallback/" target="_blank" rel="noopener noreferrer">
              fallback
            </a>{" "}
            functions.
          </Text>
          <Text color={primaryFontColor} mb="8" fontSize="lg" textAlign="center">
            <span role="img" aria-label="film icon">
              🎞
            </span>{" "}
            Watch this{" "}
            <a
              href="https://www.youtube.com/playlist?list=PLJz1HruEnenAf80uOfDwBPqaliJkjKg69"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline" }}
            >
              getting started playlist
            </a>{" "}
            to become a power user and eth scripter.
          </Text>

          <Text color={primaryFontColor} mb="0" fontSize="lg" textAlign="center">
            <span role="img" aria-label="teacher icon">
              🧑‍🚀
            </span>{" "}
            When you are ready to test your knowledge, speed run Ethereum:
          </Text>
        </Container>
        <Box
          bgImg="/assets/header_platform.svg"
          backgroundRepeat="repeat-x"
          backgroundSize="auto 130px"
          h="130px"
          mb="35px"
        />
        <Container maxW="container.lg" centerContent>
          <Box>
            {Object.entries(challengeInfo).map(([challengeId, challenge], index) => (
              <ChallengeExpandedCard
                challengeId={challengeId}
                challenge={challenge}
                challengeIndex={index}
                builderAttemptedChallenges={builderAttemptedChallenges}
                userProvider={userProvider}
                connectedBuilder={connectedBuilder}
              />
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
