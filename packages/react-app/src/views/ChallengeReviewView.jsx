import React, { useEffect } from "react";
import axios from "axios";
import ChallengeReviewList from "../components/ChallengeReviewList";

export default function ChallengeReviewView({ serverUrl, jwt, address }) {
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

  async function handleApprove(userAddress, challengeId, comment) {
    console.log(`approve ${challengeId} for ${userAddress} with comment ${comment}`);
    await axios.patch(
      serverUrl + `challenges`,
      {
        params: { userAddress, challengeId, comment, newStatus: "ACCEPTED" },
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
    console.log(`reject ${challengeId} for ${userAddress} with comment ${comment}`);
    await axios.patch(
      serverUrl + `challenges`,
      {
        params: { userAddress, challengeId, comment, newStatus: "REJECTED" },
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
