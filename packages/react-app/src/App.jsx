import React, { useCallback, useEffect, useState } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import { Web3Provider, StaticJsonRpcProvider, InfuraProvider } from "@ethersproject/providers";
import "./App.css";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import axios from "axios";
import { useUserProvider, useContractLoader, useGasPrice } from "./hooks";
import { Header, ColorModeSwitcher } from "./components";
import { NETWORKS, INFURA_ID, SERVER_URL as serverUrl } from "./constants";
import { Transactor } from "./helpers";
import {
  BuilderListView,
  ChallengeDetailView,
  BuilderProfileView,
  SubmissionReviewView,
  HomeView,
  BuildsListView,
} from "./views";
import { USER_ROLES } from "./helpers/constants";
import { providerPromiseWrapper } from "./helpers/blockchainProviders";
import BlockchainProvidersContext from "./contexts/blockchainProvidersContext";

// 😬 Sorry for all the console logging
const DEBUG = true;

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

// ToDo. Use and env var.
const targetNetwork = NETWORKS.localhost;

function App() {
  const [providers, setProviders] = useState({
    mainnet: { provider: null, isReady: false },
  });
  const [injectedProvider, setInjectedProvider] = useState();

  useEffect(() => {
    // 🛰 providers

    if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
    const scaffoldEthProviderPromise = providerPromiseWrapper(
      new StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544"),
    );

    // attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
    // Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
    scaffoldEthProviderPromise
      .then(provider => {
        if (DEBUG) console.log("📡 Connected to Mainnet Ethereum using the scaffold eth provider");
        setProviders(prevProviders => ({
          ...prevProviders,
          mainnet: { provider, isReady: true },
        }));
      })
      .catch(() => {
        if (DEBUG) console.log("❌ 📡 Connection to Mainnet Ethereum using the scaffold eth provider failed");
        const mainnetInfuraProviderPromise = providerPromiseWrapper(new InfuraProvider("mainnet", INFURA_ID));
        mainnetInfuraProviderPromise
          .then(provider => {
            if (DEBUG) console.log("📡 Connected to Mainnet Ethereum using the infura provider as callback");
            setProviders(prevProviders => ({
              ...prevProviders,
              mainnet: { provider, isReady: true },
            }));
          })
          .catch(() => {
            if (DEBUG) console.log("❌ 📡 Connection to Mainnet Ethereum using the infura provider as fallback failed");
            // ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID)
          });
      });

    if (targetNetwork.chainId !== 1) {
      // Skip mainnet, we've already connect to it.
      const targetNetworkProviderPromise = providerPromiseWrapper(new StaticJsonRpcProvider(targetNetwork.rpcUrl));
      targetNetworkProviderPromise
        .then(provider => {
          if (DEBUG) console.log("📡 Connected to", targetNetwork.name);
          setProviders(prevProviders => ({
            ...prevProviders,
            [targetNetwork.name]: { provider, isReady: true },
          }));
        })
        .catch(() => {
          if (DEBUG) console.log("❌ 📡 Connection failed to", targetNetwork.name);
        });
    }
  }, []);

  const mainnetProvider = providers.mainnet?.provider;

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  // TODO move the userProvider into the "providers" state, which is sent into the BlockchainProvidersContext
  const userProvider = useUserProvider(injectedProvider);
  // TODO address is derived from userProvider, so we should just send userProvider
  const address = useUserAddress(userProvider);

  // You can warn the user if you would like them to be on a specific network
  const targetNetworkProvider = providers[targetNetwork.name]?.provider;
  const targetNetworkChainId =
    targetNetworkProvider && targetNetworkProvider._network && targetNetworkProvider._network.chainId;
  const selectedChainId = userProvider && userProvider._network && userProvider._network.chainId;

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userProvider, { chainId: targetNetworkChainId });

  // Gets gas price for tx
  const gasPrice = useGasPrice(targetNetwork, "fast");

  const tx = Transactor(userProvider, gasPrice);

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (DEBUG && mainnetProvider && address && selectedChainId) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
    }
  }, [mainnetProvider, address, selectedChainId]);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      console.log("getting user data");
      try {
        const fetchedUserObject = await axios.get(serverUrl + `/user`, {
          params: { address },
        });
        setUserRole(USER_ROLES[fetchedUserObject.data.role] ?? USER_ROLES.registered);
      } catch (e) {
        setUserRole(USER_ROLES.anonymous);
      }
    }

    if (address) {
      fetchUserData();
    }
  }, [address]);

  return (
    <BlockchainProvidersContext.Provider value={providers}>
      <div className="App">
        {/* ✏️ Edit the header and change the title to your project name */}
        <Header
          injectedProvider={injectedProvider}
          userRole={userRole}
          address={address}
          mainnetProvider={mainnetProvider}
          userProvider={userProvider}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          setUserRole={setUserRole}
        />
        <Switch>
          <Route exact path="/">
            <HomeView />
          </Route>
          <Route exact path="/portfolio">
            {address && <Redirect to={"/builders/" + address} />}
          </Route>
          <Route exact path="/builds">
            <BuildsListView userProvider={userProvider} />
          </Route>
          <Route path="/builders" exact>
            <BuilderListView serverUrl={serverUrl} mainnetProvider={mainnetProvider} />
          </Route>
          <Route path="/builders/:builderAddress">
            <BuilderProfileView serverUrl={serverUrl} mainnetProvider={mainnetProvider} address={address} />
          </Route>
          <Route path="/challenge/:challengeId">
            <ChallengeDetailView
              serverUrl={serverUrl}
              address={address}
              userProvider={userProvider}
              userRole={userRole}
            />
          </Route>
          {/* ToDo: Protect this route on the frontend? */}
          <Route path="/submission-review" exact>
            <SubmissionReviewView
              userProvider={userProvider}
              mainnetProvider={mainnetProvider}
              writeContracts={writeContracts}
              tx={tx}
            />
          </Route>
        </Switch>
        <ColorModeSwitcher />
      </div>
    </BlockchainProvidersContext.Provider>
  );
}

if (window.ethereum) {
  window.ethereum.on("chainChanged", () => {
    if (web3Modal.cachedProvider) {
      setTimeout(() => {
        window.location.reload();
      }, 1);
    }
  });

  window.ethereum.on("accountsChanged", () => {
    if (web3Modal.cachedProvider) {
      setTimeout(() => {
        window.location.reload();
      }, 1);
    }
  });
}

export default App;
