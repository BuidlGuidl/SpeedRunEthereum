import React, { useCallback, useEffect } from "react";
import axios from "axios";
import { Container, Heading, Text, Table, Thead, Tbody, Tr, Th } from "@chakra-ui/react";
import ChallengeReviewList from "../components/ChallengeReviewList";
import useFlashMessages from "../hooks/useFlashMessages";

export default function ChallengeReviewView({ serverUrl, address, userProvider, mainnetProvider }) {
  const [challenges, setChallenges] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const flashMessages = useFlashMessages();

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
      flashMessages.error(" Sorry, the server is overloaded. 🧯🚒🔥");
      console.error(error);
      return;
    }

    let signature;
    try {
      signature = await userProvider.send("personal_sign", [signMessage, address]);
    } catch (error) {
      flashMessages.error("Couldn't get a signature from the Wallet");
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
      flashMessages.error("Can't submit the review");
      return;
    }
    flashMessages.success("Review submitted successfully");
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
          <ChallengeReviewList
            challengeSubmissions={challenges}
            isLoading={isLoading}
            approveClick={handleSendReview("ACCEPTED")}
            rejectClick={handleSendReview("REJECTED")}
            mainnetProvider={mainnetProvider}
          />
        </Tbody>
      </Table>
    </Container>
  );
}
