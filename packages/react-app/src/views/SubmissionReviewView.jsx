import React, { useCallback, useEffect } from "react";
import axios from "axios";
import { useUserAddress } from "eth-hooks";
import {
  useColorModeValue,
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
import { getDraftBuilds } from "../data/api";
import HeroIconInbox from "../components/icons/HeroIconInbox";

// TODO we could remove the dependency on serverUrl by moving api calls into src/data/api.js
// TODO we could remove the dependency on mainnetProvider by using the context (see BuilderRow.jsx)
export default function SubmissionReviewView({ serverUrl, userProvider, mainnetProvider }) {
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
    console.log("getting challenges", address);
    const fetchedChallenges = await axios.get(serverUrl + `/challenges`, {
      params: { status: "SUBMITTED" },
      headers: {
        address,
      },
    });
    setChallenges(fetchedChallenges.data);
    setIsLoadingChallenges(false);
  }, [address, serverUrl]);

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
  });

  useEffect(() => {
    if (!address) {
      return;
    }
    fetchSubmittedChallenges();
  }, [serverUrl, address, fetchSubmittedChallenges]);

  useEffect(() => {
    if (!address) {
      return;
    }
    fetchSubmittedBuilds();
  }, [address]);

  const handleSendChallengeReview = reviewType => async (userAddress, challengeId, comment) => {
    let signMessage;
    try {
      const signMessageResponse = await axios.get(serverUrl + `/sign-message`, {
        params: {
          messageId: "challengeReview",
          address,
          userAddress,
          challengeId,
          newStatus: reviewType,
        },
      });

      signMessage = JSON.stringify(signMessageResponse.data);
    } catch (error) {
      toast({
        description: " Sorry, the server is overloaded. 🧯🚒🔥",
        status: "error",
        variant: toastVariant,
      });
      console.error(error);
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
      await axios.patch(
        serverUrl + `/challenges`,
        {
          params: { userAddress, challengeId, comment, newStatus: reviewType, signature },
        },
        {
          headers: {
            address,
          },
        },
      );
    } catch (error) {
      console.error(error);
      toast({
        description: "Can't submit the review",
        status: "error",
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
      const signMessageResponse = await axios.get(serverUrl + `/sign-message`, {
        params: {
          messageId: "buildReview",
          address, // reviewer address
          buildId,
          newStatus: reviewType,
        },
      });

      signMessage = JSON.stringify(signMessageResponse.data);
    } catch (error) {
      toast({
        description: " Sorry, the server is overloaded. 🧯🚒🔥",
        status: "error",
        variant: toastVariant,
      });
      console.error(error);
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
      await axios.patch(
        serverUrl + `/builds`,
        { userAddress, buildId, newStatus: reviewType, signature },
        {
          headers: {
            address,
          },
        },
      );
    } catch (error) {
      console.error(error);
      toast({
        description: "Can't submit the review",
        status: "error",
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
          {challenges.map(challenge => (
            <ChallengeReviewRow
              key={`${challenge.userAddress}_${challenge.id}`}
              challenge={challenge}
              isLoading={isLoadingChallenges}
              approveClick={handleSendChallengeReview("ACCEPTED")}
              rejectClick={handleSendChallengeReview("REJECTED")}
              mainnetProvider={mainnetProvider}
            />
          ))}
        </Tbody>
      </Table>
      <Heading as="h2" size="lg" mt={6} mb={4}>
        Builds
      </Heading>
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
          {draftBuilds.length === 0 ? (
            <Tr>
              <Td colspan={5}>
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
    </Container>
  );
}
