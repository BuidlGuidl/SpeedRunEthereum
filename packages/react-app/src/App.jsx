import React, { useCallback, useEffect, useState } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import axios from "axios";
import { useUserProvider } from "./hooks";
import { Header } from "./components";
import { INFURA_ID, NETWORKS, SERVER_URL as serverUrl } from "./constants";
import { BuilderListView, ChallengeDetailView, BuilderProfileView, ChallengeReviewView, HomeView } from "./views";
import { USER_ROLES } from "./helpers/constants";

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.mainnet; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider = new StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544");
const mainnetInfura = new StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new StaticJsonRpcProvider(localProviderUrlFromEnv);

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

function App() {
  const mainnetProvider = scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider);
  const address = useUserAddress(userProvider);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId = userProvider && userProvider._network && userProvider._network.chainId;

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (DEBUG && mainnetProvider && address && selectedChainId) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
    }
  }, [mainnetProvider, address, selectedChainId, localChainId]);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [userRole, setUserRole] = useState(USER_ROLES.anonymous);

  useEffect(() => {
    async function fetchUserData() {
      console.log("getting user data");
      try {
        const fetchedUserObject = await axios.get(serverUrl + `/user`, {
          params: { address },
        });
        setUserRole(fetchedUserObject.data.isAdmin ? USER_ROLES.admin : USER_ROLES.registered);
      } catch (e) {
        setUserRole(USER_ROLES.anonymous);
      }
    }

    if (address) {
      fetchUserData();
    }
  }, [address]);

  return (
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
        <Route exact path="/my-profile">
          {address && <Redirect to={"/builders/" + address} />}
        </Route>
        <Route path="/builders" exact>
          <BuilderListView serverUrl={serverUrl} mainnetProvider={mainnetProvider} />
        </Route>
        <Route path="/builders/:builderAddress">
          <BuilderProfileView serverUrl={serverUrl} mainnetProvider={mainnetProvider} address={address} />
        </Route>
        <Route path="/challenge/:challengeId">
          <ChallengeDetailView serverUrl={serverUrl} address={address} userProvider={userProvider} />
        </Route>
        {/* ToDo: Protect this route on the frontend? */}
        <Route path="/challenge-review" exact>
          <ChallengeReviewView
            serverUrl={serverUrl}
            address={address}
            userProvider={userProvider}
            mainnetProvider={mainnetProvider}
          />
        </Route>
      </Switch>
    </div>
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
