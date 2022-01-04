import React, { useState } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { Button, Heading, FormControl, FormLabel, Input, Text, Tooltip, useToast } from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { isValidUrl } from "../helpers/strings";

const serverPath = "/challenges";

// ToDo. on-line form validation
export default function ChallengeSubmission({ challenge, serverUrl, address, userProvider }) {
  const { challengeId } = useParams();
  const history = useHistory();
  const toast = useToast({ position: "top", isClosable: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState("");
  const [contractUrl, setContractUrl] = useState("");
  const [hasErrorField, setHasErrorField] = useState({ deployedUrl: false, contractUrl: false });

  const onFinish = async () => {
    if (!deployedUrl || !contractUrl) {
      toast({
        status: "error",
        description: "Both fields are required",
      });
      return;
    }

    if (!isValidUrl(deployedUrl) || !isValidUrl(contractUrl)) {
      toast({
        status: "error",
        title: "Please provide a valid URL",
        description: "Valid URLs start with http:// or https://",
      });

      setHasErrorField({
        deployedUrl: !isValidUrl(deployedUrl),
        contractUrl: !isValidUrl(contractUrl),
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
          contractUrl,
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
    history.push("/portfolio");
  };

  if (!address) {
    return (
      <Text color="orange.400" className="warning" align="center">
        Connect your wallet to submit this Challenge.
      </Text>
    );
  }

  return (
    <div>
      <Heading as="h2" size="md" mb={4}>
        {challenge.label}
      </Heading>
      {challenge.isDisabled ? (
        <Text color="orange.400" className="warning">
          This challenge is disabled.
        </Text>
      ) : (
        <form name="basic" autoComplete="off">
          <FormControl id="deployedUrl" isRequired>
            <FormLabel>
              Deployed URL{" "}
              <Tooltip label="Your deployed challenge URL on surge / s3 / ipfs ">
                <QuestionOutlineIcon ml="2px" />
              </Tooltip>
            </FormLabel>
            <Input
              type="text"
              name="deployedUrl"
              value={deployedUrl}
              placeholder="https://your-site.surge.sh"
              onChange={e => {
                setDeployedUrl(e.target.value);
                if (hasErrorField.deployedUrl) {
                  setHasErrorField(prevErrorsFields => ({
                    ...prevErrorsFields,
                    deployedUrl: false,
                  }));
                }
              }}
              borderColor={hasErrorField.deployedUrl && "red.500"}
            />
          </FormControl>

          <FormControl id="contractUrl" isRequired mt={4}>
            <FormLabel>
              Etherscan Contract URL{" "}
              <Tooltip label="Your verified contract URL on Etherscan">
                <QuestionOutlineIcon ml="2px" />
              </Tooltip>
            </FormLabel>
            <Input
              type="text"
              name="contractUrl"
              value={contractUrl}
              placeholder="https://etherscan.io/address/your-contract-address"
              onChange={e => {
                setContractUrl(e.target.value);
                if (hasErrorField.contractUrl) {
                  setHasErrorField(prevErrorsFields => ({
                    ...prevErrorsFields,
                    contractUrl: false,
                  }));
                }
              }}
              borderColor={hasErrorField.contractUrl && "red.500"}
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
