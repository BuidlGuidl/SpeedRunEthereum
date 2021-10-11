import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const serverPath = "/challenges";

// ToDo. console.error / log => notifications (chakra UI "alerts")
// ToDo. on-line form validation
export default function ChallengeSubmission({ challenge, serverUrl, address, userProvider }) {
  const { challengeId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState("");
  const [branchUrl, setBranchUrl] = useState("");

  const onFinish = async () => {
    setIsSubmitting(true);

    let signMessage;
    try {
      const signMessageResponse = await axios.get(serverUrl + `/sign-message`, {
        params: {
          messageId: "challengeSubmit",
          address,
          challengeId,
        },
      });

      signMessage = JSON.stringify(signMessageResponse.data);
    } catch (error) {
      console.error({
        message: "Can't get the message to sign. Please try again.",
        description: error.toString(),
      });
      setIsSubmitting(false);
      return;
    }

    let signature;
    try {
      signature = await userProvider.send("personal_sign", [signMessage, address]);
    } catch (error) {
      console.error({
        message: "The signature was cancelled",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        serverUrl + serverPath,
        {
          challengeId,
          deployedUrl,
          branchUrl,
          signature,
        },
        {
          headers: {
            address,
          },
        },
      );
    } catch (error) {
      console.error({
        message: "Submission Error. Please try again.",
        description: error.toString(),
      });
      setIsSubmitting(false);

      return;
    }

    console.log({
      message: "Challenge submitted!",
    });
    setIsSubmitting(false);
  };

  if (!address) {
    return <p className="warning">Connect your wallet to submit this Challenge.</p>;
  }

  return (
    <div>
      <h2>Submit Challenge: {challenge.label}</h2>
      {challenge.isDisabled ? (
        <p className="warning">This challenge is disabled.</p>
      ) : (
        <form name="basic" autoComplete="off">
          <label htmlFor="deployedUrl">
            Deployed URL
            <input
              type="text"
              name="deployedUrl"
              value={deployedUrl}
              onChange={e => {
                setDeployedUrl(e.target.value);
              }}
            />
          </label>

          <label htmlFor="branchUrl">
            Branch URL
            <input
              type="text"
              name="branchUrl"
              value={branchUrl}
              onChange={e => {
                setBranchUrl(e.target.value);
              }}
            />
          </label>
          <div className="form-item">
            <button type="button" onClick={onFinish} disabled={isSubmitting}>
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
