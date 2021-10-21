import React, { useCallback, useEffect } from "react";
import axios from "axios";
import { Container, Heading, Text, Table, Thead, Tbody, Tr, Th, useToast } from "@chakra-ui/react";
import ChallengeReviewRow from "../components/ChallengeReviewRow";

export default function ChallengeReviewView({ serverUrl, address, userProvider, mainnetProvider }) {
  const [challenges, setChallenges] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const toast = useToast({ position: "top", isClosable: true });

  const fetchSubmittedChallenges = useCallback(async () => {
    setIsLoading(true);
    console.log("getting challenges", address);
    const fetchedChallenges = await axios.get(serverUrl + `/challenges`, {
      params: { status: "SUBMITTED" },
      headers: {
        address,
      },
    });
    setChallenges(fetchedChallenges.data);
    console.log(fetchedChallenges.data);
    setIsLoading(false);
  }, [address, serverUrl]);

  useEffect(() => {
    fetchSubmittedChallenges();
  }, [serverUrl, address, fetchSubmittedChallenges]);

  const handleSendReview = reviewType => async (userAddress, challengeId, comment) => {
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
      });
      return;
    }
    toast({
      description: "Review submitted successfully",
      status: "success",
    });
    fetchSubmittedChallenges();
  };

  return (
    <Container maxW="container.lg">
      <Container maxW="container.md" centerContent>
        <Heading as="h1">Review Submissions</Heading>
        <Text color="gray.700" mb="6">Pending submissions to validate.</Text>
      </Container>
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
              challenge={challenge}
              isLoading={isLoading}
              approveClick={handleSendReview("ACCEPTED")}
              rejectClick={handleSendReview("REJECTED")}
              mainnetProvider={mainnetProvider}
            />
          ))}
        </Tbody>
      </Table>
    </Container>
  );
}
