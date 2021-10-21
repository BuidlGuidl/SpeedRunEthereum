import React, { useState } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { Button, Heading, FormControl, FormLabel, Input, Text, useToast } from "@chakra-ui/react";

const serverPath = "/challenges";

// ToDo. on-line form validation
export default function ChallengeSubmission({ challenge, serverUrl, address, userProvider }) {
  const { challengeId } = useParams();
  const history = useHistory();
  const toast = useToast({ position: "top", isClosable: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState("");
  const [branchUrl, setBranchUrl] = useState("");

  const onFinish = async () => {
    if (!deployedUrl || !branchUrl) {
      toast({
        status: "error",
        description: "Can't get the message to sign. Please try again",
      });
      return;
    }

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
      toast({
        description: "Can't get the message to sign. Please try again",
        status: "error",
      });
      setIsSubmitting(false);
      return;
    }

    let signature;
    try {
      signature = await userProvider.send("personal_sign", [signMessage, address]);
    } catch (error) {
      toast({
        status: "error",
        description: "The signature was cancelled",
      });
      console.error(error);
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
      toast({
        status: "error",
        description: "Submission Error. Please try again.",
      });
      console.error(error);
      setIsSubmitting(false);

      return;
    }

    toast({
      status: "success",
      description: "Challenge submitted!",
    });
    setIsSubmitting(false);
    history.push("/my-profile");
  };

  if (!address) {
    return <Text color="orange.400" className="warning" align="center">Connect your wallet to submit this Challenge.</Text>;
  }

  return (
    <div>
      <Heading as="h2" size="md" mb={4}>Submit Challenge: {challenge.label}</Heading>
      {challenge.isDisabled ? (
        <Text color="orange.400" className="warning">This challenge is disabled.</Text>
      ) : (
        <form name="basic" autoComplete="off">
          <FormControl id="deployedUrl" isRequired>
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

          <FormControl id="branchUrl" isRequired mt={4}>
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
            <Button colorScheme="blue" onClick={onFinish} isLoading={isSubmitting} mt={4} isFullWidth>
              Submit
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
