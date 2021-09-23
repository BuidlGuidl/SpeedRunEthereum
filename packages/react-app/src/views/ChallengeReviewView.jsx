import React, { useEffect } from "react";
import axios from "axios";
import ChallengeReviewList from "../components/ChallengeReviewList";
import { notification } from "antd";

export default function ChallengeReviewView({ serverUrl, jwt, address, userProvider }) {
  const [challenges, setChallenges] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  async function fetchSubmittedChallenges() {
    setIsLoading(true);
    console.log("getting challenges", address);
    const fetchedChallenges = await axios.get(serverUrl + `challenges`, {
      params: { status: "SUBMITTED" },
      headers: {
        authorization: `token ${jwt}`,
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

  async function getSignature(challengeId, userAddress, newStatus) {
    let signMessage;
    try {
      const signMessageResponse = await axios.get(serverUrl + `sign-message`, {
        params: {
          messageId: "challengeReview",
          userAddress,
          challengeId,
          newStatus,
        },
      });

      signMessage = JSON.stringify(signMessageResponse.data);
    } catch (error) {
      notification.error({
        message: "Can't get the message to sign. Please try again.",
        description: error.toString(),
      });
    }

    return userProvider.send("personal_sign", [signMessage, address]);
  }

  async function handleApprove(userAddress, challengeId, comment) {
    const newStatus = "ACCEPTED";
    const signature = await getSignature(challengeId, userAddress, newStatus);

    console.log(`approve ${challengeId} for ${userAddress} with comment ${comment}`);
    await axios.patch(
      serverUrl + `challenges`,
      {
        params: { userAddress, challengeId, comment, newStatus, signature },
      },
      {
        headers: {
          authorization: `token ${jwt}`,
          address,
        },
      },
    );
    fetchSubmittedChallenges();
  }

  async function handleReject(userAddress, challengeId, comment) {
    const newStatus = "REJECTED";
    const signature = await getSignature(challengeId, userAddress, newStatus);

    console.log(`reject ${challengeId} for ${userAddress} with comment ${comment}`);
    await axios.patch(
      serverUrl + `challenges`,
      {
        params: { userAddress, challengeId, comment, newStatus, signature },
      },
      {
        headers: {
          authorization: `token ${jwt}`,
          address,
        },
      },
    );
    fetchSubmittedChallenges();
  }

  return (
    <div className="container">
      <h1>Challenge Submissions Ready for Review!</h1>
      <div style={{ textAlign: "start" }}>
        <ChallengeReviewList
          challengeSubmissions={challenges}
          isLoading={isLoading}
          approveClick={handleApprove}
          rejectClick={handleReject}
        />
      </div>
    </div>
  );
}
