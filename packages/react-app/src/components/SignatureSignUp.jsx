import React, { useState } from "react";
import axios from "axios";
import { forwardRef, chakra, Button, useToast } from "@chakra-ui/react";
import { SERVER_URL as serverUrl } from "../constants";
import { USER_ROLES } from "../helpers/constants";

const SignatureSignUp = forwardRef(({ address, userProvider, onSuccess, setUserRole }, ref) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast({ position: "top", isClosable: true });

  const handleLoginSigning = async () => {
    setLoading(true);
    let signMessage;
    try {
      const signMessageResponse = await axios.get(`${serverUrl}/sign-message`, {
        params: {
          messageId: "login",
          address,
        },
      });
      signMessage = signMessageResponse.data;
      console.log("signMessage", signMessage);
    } catch (e) {
      // TODO handle errors. Issue #25 https://github.com/moonshotcollective/scaffold-directory/issues/25
      toast({
        description: " Sorry, the server is overloaded. 🧯🚒🔥",
        status: "error",
      });
      setLoading(false);
      console.log(e);
      return;
    }

    if (!signMessage) {
      toast({
        description: " Sorry, the server is overloaded. 🧯🚒🔥",
        status: "error",
      });
      setLoading(false);
      return;
    }

    let signature;
    try {
      signature = await userProvider.send("personal_sign", [signMessage, address]);
    } catch (err) {
      toast({
        description: "Couldn't get a signature from the Wallet",
        status: "error",
      });
      setLoading(false);
      return;
    }
    console.log("signature", signature);

    const res = await axios.post(`${serverUrl}/sign`, {
      address,
      signature,
    });

    setLoading(false);

    if (res.data) {
      onSuccess();
      setUserRole(USER_ROLES[res.data.role] ?? USER_ROLES.registered);
    }
  };

  return (
    <Button ref={ref} colorScheme="blue" disabled={loading} onClick={handleLoginSigning}>
      <span role="img" aria-label="write icon">✍</span><chakra.span ml={2}>Register</chakra.span>
    </Button>
  );
});

export default SignatureSignUp;
