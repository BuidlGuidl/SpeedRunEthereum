import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { message as uiMessage, notification, Button } from "antd";

// TODO there are 3 was of showing errors here: `setError`, `uiMessage`, `notification`
// the standard in other places seems to be `notification`
export default function SignInView({ serverUrl, address, userProvider, successCallback }) {
  const history = useHistory();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const handleLoginSigning = async () => {
    setLoading(true);
    try {
      const signMessageResponse = await axios.get(`${serverUrl}sign-message`, {
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
        notification.error({
          message: "The signature was cancelled",
        });
        setLoading(false);
        return;
      }
      console.log("signature", signature);

      const res = await axios.post(`${serverUrl}sign`, {
        address,
        signature,
      });

      setLoading(false);

      if (res.data) {
        successCallback(res.data);
        history.push("/my-profile");
      }
    } catch (e) {
      // TODO handle errors. Issue #25 https://github.com/moonshotcollective/scaffold-directory/issues/25
      console.log(e);
      uiMessage.error(" Sorry, the server is overloaded. 🧯🚒🔥");
      console.log("FAILED TO GET...");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      {/* ToDo. Also hide this if there is no wallet connected. Check `UserProvider.js`: Do we need a burner in this? */}
      <Button loading={loading} style={{ marginTop: 32 }} type="primary" onClick={handleLoginSigning}>
        <span style={{ marginRight: 8 }}>🔏</span> sign a message with your ethereum welcome
      </Button>
      <h2 style={{ marginTop: 32 }}>Activity feed</h2>
    </div>
  );
}
