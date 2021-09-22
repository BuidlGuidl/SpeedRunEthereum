import React from "react";
import axios from "axios";
import { useUserAddress } from "eth-hooks";

const JwtTest = ({ serverUrl, jwt, userProvider }) => {
  const address = useUserAddress(userProvider);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", width: 400, margin: "auto" }}>
        <h2>⚠️ Don&apos;t forget to sign the message at `/`, otherwise you won&apos;t have a token</h2>
        <div>
          <button
            style={{ marginTop: 20 }}
            type="button"
            onClick={async () => {
              try {
                const response = await axios.get(`${serverUrl}auth-jwt-restricted`, {
                  headers: {
                    authorization: `token ${jwt}`,
                    address,
                  },
                });
                console.log(response);
              } catch (error) {
                console.log(error);
              }
            }}
          >
            This sends valid JWT
          </button>
          <br />
          <span>Should fail if you signed with one account, and then switched accounts</span>
        </div>
        <div>
          <button
            style={{ marginTop: 20 }}
            type="button"
            onClick={async () => {
              try {
                const response = await axios.get(`${serverUrl}auth-jwt-admin-restricted`, {
                  headers: {
                    authorization: `token ${jwt}`,
                    address,
                  },
                });
                console.log(response);
              } catch (error) {
                console.log(error);
              }
            }}
          >
            This sends valid JWT (to an Admin route)
          </button>
          <br />
          <span>Should fail if you signed with one account, and then switched accounts.</span>
          <span>Should fail if you are signed in but you are not an admin.</span>
        </div>
        <button
          style={{ marginTop: 20 }}
          type="button"
          onClick={async () => {
            try {
              const response = await axios.get(`${serverUrl}auth-jwt-restricted`, {
                headers: {
                  address,
                },
              });
              console.log(response);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          This send without JWT
        </button>
        <button
          style={{ marginTop: 20 }}
          type="button"
          onClick={async () => {
            try {
              const response = await axios.get(`${serverUrl}auth-jwt-restricted`, {
                headers: {
                  authorization: `token ${jwt}`,
                },
              });
              console.log(response);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          This send without address
        </button>
        <button
          style={{ marginTop: 20 }}
          type="button"
          onClick={async () => {
            try {
              const response = await axios.get(`${serverUrl}auth-jwt-restricted`, {
                headers: {
                  authorization: `token ${jwt}`,
                  address: address.slice(0, -4) + "0000",
                },
              });
              console.log(response);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          This send fake address
        </button>
        <button
          style={{ marginTop: 20 }}
          type="button"
          onClick={async () => {
            try {
              const response = await axios.get(`${serverUrl}auth-jwt-restricted`, {
                headers: {
                  authorization: `token ${jwt}0000`,
                  address,
                },
              });
              console.log(response);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          This send fake JWT
        </button>
      </div>
    </>
  );
};

export default JwtTest;
