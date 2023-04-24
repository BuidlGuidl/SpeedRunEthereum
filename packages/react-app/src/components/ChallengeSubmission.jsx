import React, { useState } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { Button, Heading, FormControl, FormLabel, Input, Text, Tooltip, useToast } from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { FormattedMessage, useIntl } from "react-intl";
import { isValidEtherscanTestnetUrl, isValidUrl } from "../helpers/strings";

const serverPath = "/challenges";

export default function ChallengeSubmission({ challenge, serverUrl, address, userProvider }) {
  const { challengeId } = useParams();
  const history = useHistory();
  const toast = useToast({ position: "top", isClosable: true });
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState("");
  const [contractUrl, setContractUrl] = useState("");
  const [hasErrorField, setHasErrorField] = useState({ deployedUrl: false, contractUrl: false });

  const onFinish = async () => {
    if (!deployedUrl || !contractUrl) {
      toast({
        status: "error",
        description: intl.formatMessage({
          id: "challengeSubmission.error.both-fields-required",
          defaultMessage: "Both fields are required",
        }),
      });
      return;
    }

    if (!isValidUrl(deployedUrl) || !isValidUrl(contractUrl)) {
      toast({
        status: "error",
        title: intl.formatMessage({
          id: "challengeSubmission.error.invalid-url.title",
          defaultMessage: "Please provide a valid URL",
        }),
        description: intl.formatMessage({
          id: "challengeSubmission.error.invalid-url.description",
          defaultMessage: "Valid URLs start with http:// or https://",
        }),
      });

      setHasErrorField({
        deployedUrl: !isValidUrl(deployedUrl),
        contractUrl: !isValidUrl(contractUrl),
      });

      return;
    }

    if (!isValidEtherscanTestnetUrl(contractUrl)) {
      toast({
        status: "error",
        title: intl.formatMessage({
          id: "challengeSubmission.error.incorrect-contract.title",
          defaultMessage: "Incorrect Etherscan Contract URL",
        }),
        description: intl.formatMessage({
          id: "challengeSubmission.error.incorrect-contract.description",
          defaultMessage:
            "Please submit your verified contract’s address on a valid testnet. e.g. https://goerli.etherscan.io/address/**Your Contract Address**",
        }),
      });

      setHasErrorField({
        contractUrl: true,
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
        description: intl.formatMessage({
          id: "general.error.cant-get-message",
          defaultMessage: "Can't get the message to sign. Please try again",
        }),
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
        description: intl.formatMessage({
          id: "general.error.signature-cancelled",
          defaultMessage: "The signature was cancelled",
        }),
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
        description: intl.formatMessage({
          id: "general.error.submission-error",
          defaultMessage: "Submission Error. Please try again.",
        }),
      });
      console.error(error);
      setIsSubmitting(false);

      return;
    }

    toast({
      status: "success",
      description: intl.formatMessage({
        id: "challengeSubmission.challenge-submitted",
        defaultMessage: "Challenge submitted!",
      }),
    });
    setIsSubmitting(false);
    history.push("/portfolio");
  };

  if (!address) {
    return (
      <Text color="orange.400" className="warning" align="center">
        <FormattedMessage
          id="challengeSubmission.connect-wallet"
          defaultMessage="Connect your wallet to submit this Challenge."
        />
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
          <FormattedMessage id="challengeSubmission.disabled" defaultMessage="This challenge is disabled." />
        </Text>
      ) : (
        <form name="basic" autoComplete="off">
          <FormControl id="deployedUrl" isRequired>
            <FormLabel>
              <FormattedMessage id="challengeSubmission.deployed-url" defaultMessage="Deployed URL" />{" "}
              <Tooltip
                label={
                  <FormattedMessage
                    id="challengeSubmission.deployed-url.tooltip"
                    defaultMessage="Your deployed challenge URL on surge / s3 / ipfs"
                  />
                }
              >
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
              <FormattedMessage id="challengeSubmission.etherscan-url" defaultMessage="Etherscan Contract URL" />{" "}
              <Tooltip
                label={
                  <FormattedMessage
                    id="challengeSubmission.etherscan-url.tooltip"
                    defaultMessage="Your verified contract URL on Etherscan"
                  />
                }
              >
                <QuestionOutlineIcon ml="2px" />
              </Tooltip>
            </FormLabel>
            <Input
              type="text"
              name="contractUrl"
              value={contractUrl}
              placeholder="https://goerli.etherscan.io/address/**YourContractAddress**"
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
              <FormattedMessage id="general.Submit" defaultMessage="Submit" />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
