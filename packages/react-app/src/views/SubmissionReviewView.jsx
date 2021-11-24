import React, { useCallback, useEffect } from "react";
import { useUserAddress } from "eth-hooks";
import {
  useColorModeValue,
  Box,
  Container,
  Heading,
  Icon,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from "@chakra-ui/react";
import ChallengeReviewRow from "../components/ChallengeReviewRow";
import BuildReviewRow from "../components/BuildReviewRow";
import useCustomColorModes from "../hooks/useCustomColorModes";
import {
  getBuildReviewSignMessage,
  getChallengeReviewSignMessage,
  getDraftBuilds,
  getSubmittedChallenges,
  patchBuildReview,
  patchChallengeReview,
} from "../data/api";
import HeroIconInbox from "../components/icons/HeroIconInbox";

export default function SubmissionReviewView({ userProvider, writeContracts, tx }) {
  const address = useUserAddress(userProvider);
  const [challenges, setChallenges] = React.useState([]);
  const [isLoadingChallenges, setIsLoadingChallenges] = React.useState(true);
  const [draftBuilds, setDraftBuilds] = React.useState([]);
  const [isLoadingDraftBuilds, setIsLoadingDraftBuilds] = React.useState(true);
  const toast = useToast({ position: "top", isClosable: true });
  const toastVariant = useColorModeValue("subtle", "solid");
  const { secondaryFontColor } = useCustomColorModes();

  const fetchSubmittedChallenges = useCallback(async () => {
    setIsLoadingChallenges(true);
    let fetchedChallenges;
    try {
      fetchedChallenges = await getSubmittedChallenges(address);
    } catch (error) {
      toast({
        description: "There was an error getting the submitted challenges. Please try again",
        status: "error",
        variant: toastVariant,
      });
    }
    setChallenges(fetchedChallenges);
    setIsLoadingChallenges(false);
  }, [address, toastVariant, toast]);

  const fetchSubmittedBuilds = useCallback(async () => {
    setIsLoadingDraftBuilds(true);
    let fetchedDraftBuilds;
    try {
      fetchedDraftBuilds = await getDraftBuilds(address);
    } catch (error) {
      toast({
        description: "There was an error getting the draft builds. Please try again",
        status: "error",
        variant: toastVariant,
      });
    }
    setDraftBuilds(fetchedDraftBuilds);
    setIsLoadingDraftBuilds(false);
  }, [address, toastVariant, toast]);

  useEffect(() => {
    if (!address) {
      return;
    }
    fetchSubmittedChallenges();
    // eslint-disable-next-line
  }, [address]);

  useEffect(() => {
    if (!address) {
      return;
    }
    fetchSubmittedBuilds();
    // eslint-disable-next-line
  }, [address]);

  //Handle mint, to be merged into Approve...
  const handleMint = async ( userAddress, ...props) => {
    try {
      const mintTx = await tx(writeContracts.BuidlBadges.mint(userAddress, "0"));
      console.log(userAddress)
    } catch (e) {
      console.log("mint tx error:", e); 
    }
  };

  const handleSendChallengeReview = reviewType => async (userAddress, challengeId, comment) => {
    let signMessage;
    try {
      signMessage = await getChallengeReviewSignMessage(address, userAddress, challengeId, reviewType);
    } catch (error) {
      toast({
        description: " Sorry, the server is overloaded. 🧯🚒🔥",
        status: "error",
        variant: toastVariant,
      });
      return;
    }

    let signature;
    try {
      signature = await userProvider.send("personal_sign", [signMessage, address]);
    } catch (error) {
      toast({
        description: "Couldn't get a signature from the Wallet",
        status: "error",
        variant: toastVariant,
      });
      console.error(error);
      return;
    }

    try {
      await patchChallengeReview(address, signature, { userAddress, challengeId, newStatus: reviewType, comment });
    } catch (error) {
      if (error.status === 401) {
        toast({
          status: "error",
          description: "Submission Error. You don't have the required role.",
          variant: toastVariant,
        });
        return;
      }
      toast({
        status: "error",
        description: "Submission Error. Please try again.",
        variant: toastVariant,
      });
      return;
    }
    toast({
      description: "Review submitted successfully",
      status: "success",
      variant: toastVariant,
    });
    fetchSubmittedChallenges();
  };

  const handleSendBuildReview = reviewType => async (userAddress, buildId) => {
    let signMessage;
    try {
      signMessage = await getBuildReviewSignMessage(address, buildId, reviewType);
    } catch (error) {
      toast({
        description: " Sorry, the server is overloaded. 🧯🚒🔥",
        status: "error",
        variant: toastVariant,
      });
      return;
    }

    let signature;
    try {
      signature = await userProvider.send("personal_sign", [signMessage, address]);
    } catch (error) {
      toast({
        description: "Couldn't get a signature from the Wallet",
        status: "error",
        variant: toastVariant,
      });
      return;
    }

    try {
      await patchBuildReview(address, signature, { userAddress, buildId, newStatus: reviewType });
    } catch (error) {
      if (error.status === 401) {
        toast({
          status: "error",
          description: "Submission Error. You don't have the required role.",
          variant: toastVariant,
        });
        return;
      }
      toast({
        status: "error",
        description: "Submission Error. Please try again.",
        variant: toastVariant,
      });
      return;
    }

    toast({
      description: "Review submitted successfully",
      status: "success",
      variant: toastVariant,
    });
    fetchSubmittedBuilds();
  };

  return (
    <Container maxW="container.lg">
      <Container maxW="container.md" centerContent>
        <Heading as="h1">Review Submissions</Heading>
        <Text color={secondaryFontColor} mb="6">
          Pending submissions to validate.
        </Text>
      </Container>
      <Heading as="h2" size="lg" mt={6} mb={4}>
        Challenges
      </Heading>
      <Box overflowX="auto">
        <Table>
        <Thead>
          <Tr>
            <Th>Builder</Th>
            <Th>Challenge</Th>
            <Th>Code</Th>
            <Th>Live demo</Th>
            <Th>Comment</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {!challenges || challenges.length === 0 ? (
            <Tr>
              <Td colSpan={6}>
                <Text color={secondaryFontColor} textAlign="center" mb={4}>
                  <Icon as={HeroIconInbox} w={6} h={6} color={secondaryFontColor} mt={6} mb={4} />
                  <br />
                  All challenges have been reviewed
                </Text>
              </Td>
            </Tr>
          ) : (
            challenges.map(challenge => (
              <ChallengeReviewRow
                key={`${challenge.userAddress}_${challenge.id}`}
                challenge={challenge}
                isLoading={isLoadingChallenges}
                approveClick={handleSendChallengeReview("ACCEPTED")}
                rejectClick={handleSendChallengeReview("REJECTED")}
                mintClick={handleMint}
              />
            ))
          )}
        </Tbody>
      </Table>
      </Box>
      <Heading as="h2" size="lg" mt={6} mb={4}>
        Builds
      </Heading>
      <Box overflowX="auto">
        <Table mb={4}>
        <Thead>
          <Tr>
            <Th>Builder</Th>
            <Th>Build Name</Th>
            <Th>Description</Th>
            <Th>Branch URL</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {!draftBuilds || draftBuilds.length === 0 ? (
            <Tr>
              <Td colSpan={5}>
                <Text color={secondaryFontColor} textAlign="center" mb={4}>
                  <Icon as={HeroIconInbox} w={6} h={6} color={secondaryFontColor} mt={6} mb={4} />
                  <br />
                  All builds have been reviewed
                </Text>
              </Td>
            </Tr>
          ) : (
            draftBuilds.map(build => (
              <BuildReviewRow
                key={`${build.userAddress}_${build.id}`}
                build={build}
                isLoading={isLoadingDraftBuilds}
                approveClick={handleSendBuildReview("ACCEPTED")}
                rejectClick={handleSendBuildReview("REJECTED")}
              />
            ))
          )}
        </Tbody>
      </Table>
      </Box>
    </Container>
  );
}
