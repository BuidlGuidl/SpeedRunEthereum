import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { message as uiMessage, Button } from "antd";

export default function SignInView({ serverUrl, address, userProvider, successCallback, userObject }) {
  const history = useHistory();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  if (userObject != null && Object.keys(userObject).length !== 0) {
    history.push("/profile");
  }
  return (
    <div>
      {" "}
      {error ? (
        <div>{error}</div>
      ) : (
        <Button
          loading={loading}
          style={{ marginTop: 32 }}
          type="primary"
          onClick={async () => {
            setLoading(true);
            try {
              const msgToSign = await axios.get(`${serverUrl}sign-message`);
              console.log("msgToSign", msgToSign);
              if (msgToSign.data && msgToSign.data.length > 32) {
                // <--- traffic escape hatch?
                let currentLoader = setTimeout(() => {
                  setLoading(false);
                }, 4000);
                const message = msgToSign.data.replace("**ADDRESS**", address);
                const sig = await userProvider.send("personal_sign", [message, address]);
                clearTimeout(currentLoader);
                currentLoader = setTimeout(() => {
                  setLoading(false);
                }, 4000);
                console.log("sig", sig);
                const res = await axios.post(`${serverUrl}sign`, {
                  address,
                  message,
                  signature: sig,
                });
                clearTimeout(currentLoader);
                setLoading(false);
                console.log("RESULT:", res);
                if (res.data) {
                  successCallback(res.data);
                  history.push("/profile");
                }
              } else {
                setLoading(false);
                setError("😅 Sorry, the server is overloaded. Please try again later. ⏳");
              }
            } catch (e) {
              console.log(e);
              uiMessage.error(" Sorry, the server is overloaded. 🧯🚒🔥");
              console.log("FAILED TO GET...");
            }
          }}
        >
          <span style={{ marginRight: 8 }}>🔏</span> sign a message with your ethereum welcome
        </Button>
      )}
    </div>
  );
}
