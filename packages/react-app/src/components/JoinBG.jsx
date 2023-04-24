import React, { useState } from "react";
import axios from "axios";
import { chakra, useToast, Button, Link } from "@chakra-ui/react";
import { FormattedMessage, useIntl } from "react-intl";
import { SERVER_URL as serverUrl } from "../constants";

const serverPath = "/bg/join";

export default function JoinBG({ text, connectedBuilder, isChallengeLocked, userProvider, onJoinCallback }) {
  const intl = useIntl();
  const [isJoining, setIsJoining] = useState(false);
  // Optimistic update.
  const [joined, setJoined] = useState(false);
  const toast = useToast({ position: "top", isClosable: true });

  const address = connectedBuilder?.id;

  const onJoin = async () => {
    setIsJoining(true);

    if (!connectedBuilder.socialLinks || Object.keys(connectedBuilder?.socialLinks ?? {}).length === 0) {
      toast({
        title: intl.formatMessage({
          id: "joinBg.missing-socials.title",
          defaultMessage: "Can't join the BuidlGuidl",
        }),
        duration: 10000,
        description: intl.formatMessage(
          {
            id: "joinBg.missing-socials.description",
            defaultMessage: `In order to join the BuildGuidl you need to set
              your socials in <Link>your portfolio</Link>. It's our way to
              contact you.`,
          },
          {
            Link: chunks => (
              <Link href="/portfolio" textDecoration="underline">
                {chunks}
              </Link>
            ),
          },
        ),

        status: "error",
      });
      setIsJoining(false);
      return;
    }

    let signMessage;
    try {
      const signMessageResponse = await axios.get(`${serverUrl}/sign-message`, {
        params: {
          messageId: "bgJoin",
          address,
        },
      });

      signMessage = signMessageResponse.data;
    } catch (error) {
      toast({
        description: intl.formatMessage({
          id: "general.error.cant-get-message",
          defaultMessage: "Can't get the message to sign. Please try again",
        }),
        status: "error",
      });
      setIsJoining(false);
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
      setIsJoining(false);
      return;
    }

    try {
      await axios.post(
        serverUrl + serverPath,
        {
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
        description:
          error?.response?.data ??
          intl.formatMessage({
            id: "general.error.submission-error",
            defaultMessage: "Submission Error. Please try again.",
          }),
      });
      console.error(error);
      setIsJoining(false);

      return;
    }

    toast({
      status: "success",
      duration: 10000,
      title: intl.formatMessage({ id: "joinBg.success.title", defaultMessage: "Welcome to the BuildGuidl :)" }),
      description: intl.formatMessage(
        {
          id: "joinBg.success.description",
          defaultMessage: `Visit <Link>BuidlGuidl</Link> and start crafting
            your Web3 portfolio by submitting your DEX, Multisig or SVG NFT
            build.`,
        },
        {
          Link: chunks => (
            <Link href="https://buidlguidl.com" textDecoration="underline" isExternal>
              {chunks}
            </Link>
          ),
        },
      ),
    });
    setIsJoining(false);
    setJoined(true);

    if (typeof onJoinCallback === "function") {
      onJoinCallback();
    }
  };

  const builderAlreadyJoined = !!connectedBuilder?.joinedBg;

  return (
    <Button
      onClick={onJoin}
      colorScheme="green"
      isLoading={isJoining}
      isDisabled={isChallengeLocked || builderAlreadyJoined || joined}
      variant={isChallengeLocked ? "outline" : "solid"}
      isFullWidth
      isExternal
    >
      <chakra.span>
        {builderAlreadyJoined || joined ? (
          <FormattedMessage id="joinBg.button.already-joined" defaultMessage="Already joined" />
        ) : (
          text
        )}
      </chakra.span>
    </Button>
  );
}
