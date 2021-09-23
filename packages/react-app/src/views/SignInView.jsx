import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { message as uiMessage, Button } from "antd";

export default function SignInView({ serverUrl, address, userProvider, successCallback, jwt }) {
  const history = useHistory();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  if (jwt != null && jwt !== "") {
    history.push("/home");
  }
  return (
    <div className="container">
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
              const signMessageResponse = await axios.get(`${serverUrl}sign-message`, {
                params: {
                  messageId: "login",
                  address,
                },
              });
              const signMessage = JSON.stringify(signMessageResponse.data);
              console.log("signMessage", signMessage);

              if (signMessage) {
                const sig = await userProvider.send("personal_sign", [signMessage, address]);
                console.log("sig", sig);

                const res = await axios.post(`${serverUrl}sign`, {
                  address,
                  signature: sig,
                });

                setLoading(false);

                if (res.data) {
                  successCallback(res.data);
                  history.push("/home");
                }
              } else {
                setLoading(false);
                setError("😅 Sorry, the server is overloaded. Please try again later. ⏳");
              }
            } catch (e) {
              // TODO handle errors. Issue #25 https://github.com/moonshotcollective/scaffold-directory/issues/25
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
