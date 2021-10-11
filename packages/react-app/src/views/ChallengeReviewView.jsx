import React, { useEffect } from "react";
import axios from "axios";
import ChallengeReviewList from "../components/ChallengeReviewList";

// ToDo. console.error => Chakra UI alert
export default function ChallengeReviewView({ serverUrl, address, userProvider }) {
  const [challenges, setChallenges] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  async function fetchSubmittedChallenges() {
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
  }

  useEffect(() => {
    fetchSubmittedChallenges();
  }, [serverUrl, address]);

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
      console.error({
        message: "Can't get the message to sign. Please try again.",
        description: error.toString(),
      });
      return;
    }

    let signature;
    try {
      signature = await userProvider.send("personal_sign", [signMessage, address]);
    } catch (error) {
      console.error({
        message: "The signature was cancelled",
      });
      return;
    }

    console.log(`${reviewType.toLowerCase()} ${challengeId} for ${userAddress} with comment ${comment}`);
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
    fetchSubmittedChallenges();
  };

  return (
    <div className="container">
      <h1>Challenge Submissions Ready for Review!</h1>
      <div style={{ textAlign: "start" }}>
        <ChallengeReviewList
          challengeSubmissions={challenges}
          isLoading={isLoading}
          approveClick={handleSendReview("ACCEPTED")}
          rejectClick={handleSendReview("REJECTED")}
        />
      </div>
    </div>
  );
}
