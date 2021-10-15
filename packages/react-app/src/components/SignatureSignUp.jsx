import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import useFlashMessages from "../hooks/useFlashMessages";

export default function SignatureSignUp({ serverUrl, address, userProvider }) {
  const history = useHistory();
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
      history.push("/my-profile");
    }
  };

  // ToDo. Also hide this if there is no wallet connected. Check `UserProvider.js`: Do we need a burner in this?
  return (
    <Button colorScheme="blue" disabled={loading} onClick={handleLoginSigning} my={5}>
      <span style={{ marginRight: 8 }} role="img" aria-label="lock-icon">🔏</span> Sign a message to Sign Up on Scaffold-directory
    </Button>
  );
}
