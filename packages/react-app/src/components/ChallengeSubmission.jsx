import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Heading, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";

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
    return <Text color="orange.400" className="warning">Connect your wallet to submit this Challenge.</Text>;
  }

  return (
    <div>
      <Heading as="h2" size="md">Submit Challenge: {challenge.label}</Heading>
      {challenge.isDisabled ? (
        <Text color="orange.400" className="warning">This challenge is disabled.</Text>
      ) : (
        <form name="basic" autoComplete="off">
          <FormControl id="deployedUrl">
            <FormLabel>Deployed URL</FormLabel>
            <Input
              type="text"
              name="deployedUrl"
              value={deployedUrl}
              onChange={e => {
                setDeployedUrl(e.target.value);
              }}
            />
          </FormControl>

          <FormControl id="branchUrl">
            <FormLabel>Branch URL</FormLabel>
            <Input
              type="text"
              name="branchUrl"
              value={branchUrl}
              onChange={e => {
                setBranchUrl(e.target.value);
              }}
            />
          </FormControl>

          <div className="form-item">
            <Button colorScheme="blue" onClick={onFinish} disabled={isSubmitting}>
              Submit
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
