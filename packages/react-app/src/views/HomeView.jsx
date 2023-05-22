import React, { useMemo } from "react";
import { Container, Box, Text, Center, useColorModeValue } from "@chakra-ui/react";
import { FormattedMessage, useIntl } from "react-intl";
import ChallengeExpandedCard from "../components/ChallengeExpandedCard";
import { getChallengeInfo } from "../data/challenges";
import useCustomColorModes from "../hooks/useCustomColorModes";
import HeroLogo from "../components/icons/HeroLogo";
import HeroDiamond from "../components/icons/HeroDiamond";

const BulletNumber = ({ children, bgColor, primaryFontColor }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    color={bgColor}
    bgColor={primaryFontColor}
    borderRadius="50%"
    w="20px"
    h="20px"
    mb="5px"
    fontSize="14px"
  >
    {children}
  </Box>
);

export default function HomeView({ connectedBuilder, userProvider }) {
  const { primaryFontColor, bgColor } = useCustomColorModes();
  const cardBgColor = useColorModeValue("sre.cardBackground", "sreDark.cardBackground");
  const intl = useIntl();
  const challengeInfo = getChallengeInfo(intl);
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
            <FormattedMessage
              id="index.learn-ethereum"
              defaultMessage="Learn how to build on <strong>Ethereum</strong>; the superpowers and the gotchas."
              values={{
                strong: chunks => <b>{chunks}</b>,
              }}
            />
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

          <BulletNumber primaryFontColor={primaryFontColor} bgColor={bgColor}>
            1
          </BulletNumber>
          <Text
            color={primaryFontColor}
            mb="5"
            fontSize={{
              base: "lg",
              lg: "md",
            }}
            textAlign="center"
          >
            <FormattedMessage
              id="index.step-1"
              defaultMessage="Watch this <a>quick video</a> as an Intro to Ethereum Development."
              values={{
                a: chunks => (
                  <a
                    href="https://www.youtube.com/watch?v=MlJPjJQZtC8"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "underline" }}
                  >
                    {chunks}
                  </a>
                ),
              }}
            />
          </Text>

          <BulletNumber primaryFontColor={primaryFontColor} bgColor={bgColor}>
            2
          </BulletNumber>
          <Text
            color={primaryFontColor}
            mb="2"
            fontSize={{
              base: "lg",
              lg: "md",
            }}
            textAlign="center"
          >
            <FormattedMessage
              id="index.step-2.1"
              defaultMessage="Then use <a><span>🏗</span> Scaffold-ETH</a> to copy/paste each Solidity concept and tinker:"
              values={{
                a: chunks => (
                  <a
                    style={{ textDecoration: "underline" }}
                    href="https://github.com/scaffold-eth/scaffold-eth#-scaffold-eth"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {chunks}
                  </a>
                ),
                span: chunks => (
                  <span role="img" aria-label="teacher icon">
                    {chunks}
                  </span>
                ),
              }}
            />
          </Text>

          <Text
            color={primaryFontColor}
            mb="5"
            fontSize={{
              base: "lg",
              lg: "md",
            }}
            textAlign="center"
          >
            <FormattedMessage
              id="index.step-2.2"
              defaultMessage={`
                  <a_globalUnits>global units</a_globalUnits>, <a_primitives>primitives</a_primitives
                  >, <a_mappings>mappings</a_mappings>, <a_structs>structs</a_structs>, <a_modifiers
                  >modifiers</a_modifiers>, <a_events>events</a_events>,
                `}
              values={{
                a_globalUnits: chunks => (
                  <a
                    href="https://docs.soliditylang.org/en/v0.6.6/units-and-global-variables.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chunks}
                  </a>
                ),
                a_primitives: chunks => (
                  <a target="_blank" href="https://solidity-by-example.org/primitives/" rel="noopener noreferrer">
                    {chunks}
                  </a>
                ),
                a_mappings: chunks => (
                  <a target="_blank" href="https://solidity-by-example.org/mapping/" rel="noopener noreferrer">
                    {chunks}
                  </a>
                ),
                a_structs: chunks => (
                  <a href="https://solidity-by-example.org/structs/" target="_blank" rel="noopener noreferrer">
                    {chunks}
                  </a>
                ),
                a_modifiers: chunks => (
                  <a
                    href="https://solidity-by-example.org/function-modifier/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chunks}
                  </a>
                ),
                a_events: chunks => (
                  <a href="https://solidity-by-example.org/events/" target="_blank" rel="noopener noreferrer">
                    {chunks}
                  </a>
                ),
              }}
            />{" "}
            <FormattedMessage
              id="index.step-2.3"
              defaultMessage={`
                <a_inheritance>inheritance</a_inheritance>, <a_sendingEth>sending eth</a_sendingEth
                >, and <a_payable>payable</a_payable>/<a_fallback>fallback</a_fallback> functions.
                `}
              values={{
                a_inheritance: chunks => (
                  <a href="https://solidity-by-example.org/inheritance/" target="_blank" rel="noopener noreferrer">
                    {chunks}
                  </a>
                ),
                a_sendingEth: chunks => (
                  <a href="https://solidity-by-example.org/sending-ether/" target="_blank" rel="noopener noreferrer">
                    {chunks}
                  </a>
                ),
                a_payable: chunks => (
                  <a href="https://solidity-by-example.org/payable/" target="_blank" rel="noopener noreferrer">
                    {chunks}
                  </a>
                ),
                a_fallback: chunks => (
                  <a href="https://solidity-by-example.org/fallback/" target="_blank" rel="noopener noreferrer">
                    {chunks}
                  </a>
                ),
              }}
            />
          </Text>

          <BulletNumber primaryFontColor={primaryFontColor} bgColor={bgColor}>
            3
          </BulletNumber>
          <Text
            color={primaryFontColor}
            mb="5"
            fontSize={{
              base: "lg",
              lg: "md",
            }}
            textAlign="center"
          >
            <FormattedMessage
              id="index.step-3"
              defaultMessage="Watch this <a>getting started playlist</a> to become a power user and eth scripter."
              values={{
                a: chunks => (
                  <a
                    href="https://www.youtube.com/playlist?list=PLJz1HruEnenAf80uOfDwBPqaliJkjKg69"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "underline" }}
                  >
                    {chunks}
                  </a>
                ),
              }}
            />
          </Text>

          <BulletNumber primaryFontColor={primaryFontColor} bgColor={bgColor}>
            4
          </BulletNumber>
          <Text
            color={primaryFontColor}
            mb="0"
            fontSize={{
              base: "lg",
              lg: "md",
            }}
            textAlign="center"
          >
            <FormattedMessage
              id="index.step-4"
              defaultMessage="When you are ready to test your knowledge, Speed Run Ethereum:"
            />
          </Text>
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
            key={challengeId}
            challengeId={challengeId}
            challenge={challenge}
            challengeIndex={index}
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
