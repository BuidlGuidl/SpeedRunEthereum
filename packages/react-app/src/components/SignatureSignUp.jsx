import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

// TODO there are 3 was of showing errors here: `setError`, `uiMessage`, `notification`
// the standard in other places seems to be `notification`
// ToDo. Console.error => notification (Chakra ui alert)
export default function SignatureSignUp({ serverUrl, address, userProvider }) {
  const history = useHistory();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const handleLoginSigning = async () => {
    setLoading(true);
    try {
      const signMessageResponse = await axios.get(`${serverUrl}/sign-message`, {
        params: {
          messageId: "login",
          address,
        },
      });
      const signMessage = JSON.stringify(signMessageResponse.data);
      console.log("signMessage", signMessage);

      if (!signMessage) {
        setLoading(false);
        setError("😅 Sorry, the server is overloaded. Please try again later. ⏳");
        return;
      }

      let signature;
      try {
        signature = await userProvider.send("personal_sign", [signMessage, address]);
      } catch (err) {
        console.error({
          message: "The signature was cancelled",
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
        history.push("/my-profile");
      }
    } catch (e) {
      // TODO handle errors. Issue #25 https://github.com/moonshotcollective/scaffold-directory/issues/25
      console.log(e);
      console.error(" Sorry, the server is overloaded. 🧯🚒🔥");
      console.log("FAILED TO GET...");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  // ToDo. Also hide this if there is no wallet connected. Check `UserProvider.js`: Do we need a burner in this?
  return (
    <button disabled={loading} style={{ marginTop: 32 }} type="button" onClick={handleLoginSigning}>
      <span style={{ marginRight: 8 }} role="img" aria-label="lock-icon">🔏</span> Sign a message to Sign Up on Scaffold-directory
    </button>
  );
}
