import React from "react";
import { Alert, AlertDescription, AlertTitle, Button } from "@chakra-ui/react";
import { NETWORK } from "../constants";

function NetworkDisplay({ NETWORKCHECK, localChainId, selectedChainId, targetNetwork }) {
  let networkDisplay;
  if (NETWORKCHECK && localChainId && selectedChainId && localChainId !== selectedChainId) {
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert status="warning" flexDirection="column">
            <AlertTitle>
              <span role="img" aria-label="warning icon">
                ⚠️
              </span>{" "}
              Wrong Network ID
            </AlertTitle>
            <AlertDescription>
              <p>
                You have <b>chain id 1337</b> for localhost, it should be <b>31337</b>
              </p>
              <p>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</p>
            </AlertDescription>
          </Alert>
        </div>
      );
    } else {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 80, padding: 16 }}>
          <Alert status="warning" flexDirection="column">
            <AlertTitle mb={2}>
              <span role="img" aria-label="warning icon">
                ⚠
              </span>
              ️ Wrong Network{" "}
            </AlertTitle>
            <AlertDescription>
              <p>
                You have <b>{networkSelected && networkSelected.name}</b> selected, switch to
              </p>
              <Button
                isFullWidth
                colorScheme="blue"
                mt={1}
                onClick={async () => {
                  const ethereum = window.ethereum;
                  const data = [
                    {
                      chainId: "0x" + targetNetwork.chainId.toString(16),
                      chainName: targetNetwork.name,
                      nativeCurrency: targetNetwork.nativeCurrency,
                      rpcUrls: [targetNetwork.rpcUrl],
                      blockExplorerUrls: [targetNetwork.blockExplorer],
                    },
                  ];
                  console.log("data", data);

                  let switchTx;
                  // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
                  try {
                    switchTx = await ethereum.request({
                      method: "wallet_switchEthereumChain",
                      params: [{ chainId: data[0].chainId }],
                    });
                  } catch (switchError) {
                    // not checking specific error code, because maybe we're not using MetaMask
                    try {
                      switchTx = await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: data,
                      });
                    } catch (addError) {
                      // handle "add" error
                    }
                  }

                  if (switchTx) {
                    console.log(switchTx);
                  }
                }}
              >
                <b>{networkLocal && networkLocal.name}</b>
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  } else {
    networkDisplay = (
      <div style={{ zIndex: -1, position: "absolute", right: 10, top: 0, color: targetNetwork.color }}>
        {targetNetwork.name}
      </div>
    );
  }

  return networkDisplay;
}

export default NetworkDisplay;
