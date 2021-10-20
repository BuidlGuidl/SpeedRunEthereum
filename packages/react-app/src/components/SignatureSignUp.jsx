import React, { useState } from "react";
import axios from "axios";
import { forwardRef, Button } from "@chakra-ui/react";
import useFlashMessages from "../hooks/useFlashMessages";
import { SERVER_URL as serverUrl } from "../constants";
import { USER_ROLES } from "../helpers/constants";

const SignatureSignUp = forwardRef(({ address, userProvider, onSuccess, setUserRole }, ref) => {
  const [loading, setLoading] = useState(false);
  const flashMessages = useFlashMessages();

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
      signMessage = JSON.stringify(signMessageResponse.data);
      console.log("signMessage", signMessage);
    } catch (e) {
      // TODO handle errors. Issue #25 https://github.com/moonshotcollective/scaffold-directory/issues/25
      flashMessages.error(" Sorry, the server is overloaded. 🧯🚒🔥");
      setLoading(false);
      console.log(e);
      return;
    }

    if (!signMessage) {
      setLoading(false);
      flashMessages.error(" Sorry, the server is overloaded. 🧯🚒🔥");
      return;
    }

    let signature;
    try {
      signature = await userProvider.send("personal_sign", [signMessage, address]);
    } catch (err) {
      flashMessages.error("Couldn't get a signature from the Wallet");
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
      setUserRole(res.data.isAdmin ? USER_ROLES.admin : USER_ROLES.registered);
    }
  };

  return (
    <Button ref={ref} colorScheme="blue" disabled={loading} onClick={handleLoginSigning}>
      ✍️ Register
    </Button>
  );
});

export default SignatureSignUp;
