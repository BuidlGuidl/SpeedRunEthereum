import React, { useCallback, useEffect, useRef, useState } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import { Web3Provider, StaticJsonRpcProvider, InfuraProvider } from "@ethersproject/providers";
import "./App.css";
import Web3Modal from "web3modal";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { useUserAddress } from "eth-hooks";
import axios from "axios";
import { useUserProvider } from "./hooks";
import { Header, ColorModeSwitcher } from "./components";
import { INFURA_ID, SERVER_URL as serverUrl } from "./constants";
import {
  BuilderListView,
  ChallengeDetailView,
  BuilderProfileView,
  SubmissionReviewView,
  HomeView,
  ActivityView,
} from "./views";
import { USER_ROLES } from "./helpers/constants";
import { providerPromiseWrapper } from "./helpers/blockchainProviders";
import BlockchainProvidersContext from "./contexts/blockchainProvidersContext";
import SiteFooter from "./components/SiteFooter";
import NotFoundView from "./views/NotFoundView";

// 😬 Sorry for all the console logging
const DEBUG = true;

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    "custom-walletconnect": {
      display: {
        logo: "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9IjAlIiBjeT0iNTAlIiByPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1ZDlkZjYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDZmZmYiLz48L3JhZGlhbEdyYWRpZW50PjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0ibTI1NiAwYzE0MS4zODQ4OTYgMCAyNTYgMTE0LjYxNTEwNCAyNTYgMjU2cy0xMTQuNjE1MTA0IDI1Ni0yNTYgMjU2LTI1Ni0xMTQuNjE1MTA0LTI1Ni0yNTYgMTE0LjYxNTEwNC0yNTYgMjU2LTI1NnoiIGZpbGw9InVybCgjYSkiLz48cGF0aCBkPSJtNjQuNjkxNzU1OCAzNy43MDg4Mjk4YzUxLjUzMjgwNzItNTAuMjc4NDM5NyAxMzUuMDgzOTk0Mi01MC4yNzg0Mzk3IDE4Ni42MTY3OTkyIDBsNi4yMDIwNTcgNi4wNTEwOTA2YzIuNTc2NjQgMi41MTM5MjE4IDIuNTc2NjQgNi41ODk3OTQ4IDAgOS4xMDM3MTc3bC0yMS4yMTU5OTggMjAuNjk5NTc1OWMtMS4yODgzMjEgMS4yNTY5NjE5LTMuMzc3MSAxLjI1Njk2MTktNC42NjU0MjEgMGwtOC41MzQ3NjYtOC4zMjcwMjA1Yy0zNS45NTA1NzMtMzUuMDc1NDk2Mi05NC4yMzc5NjktMzUuMDc1NDk2Mi0xMzAuMTg4NTQ0IDBsLTkuMTQwMDI4MiA4LjkxNzU1MTljLTEuMjg4MzIxNyAxLjI1Njk2MDktMy4zNzcxMDE2IDEuMjU2OTYwOS00LjY2NTQyMDggMGwtMjEuMjE1OTk3My0yMC42OTk1NzU5Yy0yLjU3NjY0MDMtMi41MTM5MjI5LTIuNTc2NjQwMy02LjU4OTc5NTggMC05LjEwMzcxNzd6bTIzMC40OTM0ODUyIDQyLjgwODkxMTcgMTguODgyMjc5IDE4LjQyMjcyNjJjMi41NzY2MjcgMi41MTM5MTAzIDIuNTc2NjQyIDYuNTg5NzU5My4wMDAwMzIgOS4xMDM2ODYzbC04NS4xNDE0OTggODMuMDcwMzU4Yy0yLjU3NjYyMyAyLjUxMzk0MS02Ljc1NDE4MiAyLjUxMzk2OS05LjMzMDg0LjAwMDA2Ni0uMDAwMDEtLjAwMDAxLS4wMDAwMjMtLjAwMDAyMy0uMDAwMDMzLS4wMDAwMzRsLTYwLjQyODI1Ni01OC45NTc0NTFjLS42NDQxNi0uNjI4NDgxLTEuNjg4NTUtLjYyODQ4MS0yLjMzMjcxIDAtLjAwMDAwNC4wMDAwMDQtLjAwMDAwOC4wMDAwMDctLjAwMDAxMi4wMDAwMTFsLTYwLjQyNjk2ODMgNTguOTU3NDA4Yy0yLjU3NjYxNDEgMi41MTM5NDctNi43NTQxNzQ2IDIuNTEzOTktOS4zMzA4NDA4LjAwMDA5Mi0uMDAwMDE1MS0uMDAwMDE0LS4wMDAwMzA5LS4wMDAwMjktLjAwMDA0NjctLjAwMDA0NmwtODUuMTQzODY3NzQtODMuMDcxNDYzYy0yLjU3NjYzOTI4LTIuNTEzOTIxLTIuNTc2NjM5MjgtNi41ODk3OTUgMC05LjEwMzcxNjNsMTguODgyMzEyNjQtMTguNDIyNjk1NWMyLjU3NjYzOTMtMi41MTM5MjIyIDYuNzU0MTk5My0yLjUxMzkyMjIgOS4zMzA4Mzk3IDBsNjAuNDI5MTM0NyA1OC45NTgyNzU4Yy42NDQxNjA4LjYyODQ4IDEuNjg4NTQ5NS42Mjg0OCAyLjMzMjcxMDMgMCAuMDAwMDA5NS0uMDAwMDA5LjAwMDAxODItLjAwMDAxOC4wMDAwMjc3LS4wMDAwMjVsNjAuNDI2MTA2NS01OC45NTgyNTA4YzIuNTc2NTgxLTIuNTEzOTggNi43NTQxNDItMi41MTQwNzQzIDkuMzMwODQtLjAwMDIxMDMuMDAwMDM3LjAwMDAzNTQuMDAwMDcyLjAwMDA3MDkuMDAwMTA3LjAwMDEwNjNsNjAuNDI5MDU2IDU4Ljk1ODM1NDhjLjY0NDE1OS42Mjg0NzkgMS42ODg1NDkuNjI4NDc5IDIuMzMyNzA5IDBsNjAuNDI4MDc5LTU4Ljk1NzE5MjVjMi41NzY2NC0yLjUxMzkyMzEgNi43NTQxOTktMi41MTM5MjMxIDkuMzMwODM5IDB6IiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk4IDE2MCkiLz48L2c+PC9zdmc+",
        name: "WalletConnect",
        description: "Scan with WalletConnect to connect",
      },
      options: {
        projecId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
        chains: [1],
      },
      package: EthereumProvider,
      connector: async (ProviderPackage, options) => {
        const provider = await ProviderPackage.init({
          projectId: options.projecId,
          chains: options.chains,
          showQrModal: true,
        });
        await provider.enable();
        return provider;
      },
    },
  },
});

function App() {
  const [providers, setProviders] = useState({
    mainnet: { provider: null, isReady: false },
    local: { provider: null, isReady: false },
  });

  const connectWalletRef = useRef(false);

  useEffect(() => {
    // 🛰 providers

    /*
    //This code is needed if you want a local and a mainnet provider

    // 📡 What chain are your contracts deployed to?
    const targetNetwork = NETWORKS.mainnet; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

    // 🏠 Your local provider is usually pointed at your local blockchain
    const localProviderUrl = targetNetwork.rpcUrl;

    // as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
    const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;

    const localProviderPromise = providerPromiseWrapper(new StaticJsonRpcProvider(localProviderUrlFromEnv));
    */

    if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
    const scaffoldEthProviderPromise = providerPromiseWrapper(
      new StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544"),
    );

    // attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
    // Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
    scaffoldEthProviderPromise
      .then(provider => {
        if (DEBUG) console.log("📡 Connected to Mainnet Ethereum using the scaffold eth provider");
        setProviders({ mainnet: { provider, isReady: true } });
      })
      .catch(() => {
        if (DEBUG) console.log("❌ 📡 Connection to Mainnet Ethereum using the scaffold eth provider failed");
        const mainnetInfuraProviderPromise = providerPromiseWrapper(new InfuraProvider("mainnet", INFURA_ID));
        mainnetInfuraProviderPromise
          .then(provider => {
            if (DEBUG) console.log("📡 Connected to Mainnet Ethereum using the infura provider as callback");
            setProviders({ mainnet: { provider, isReady: true } });
          })
          .catch(() => {
            if (DEBUG) console.log("❌ 📡 Connection to Mainnet Ethereum using the infura provider as fallback failed");
            // ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID)
          });
      });
  }, []);

  const mainnetProvider = providers.mainnet?.provider;

  const [injectedProvider, setInjectedProvider] = useState();

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  // TODO move the userProvider into the "providers" state, which is sent into the BlockchainProvidersContext
  const userProvider = useUserProvider(injectedProvider);
  // TODO address is derived from userProvider, so we should just send userProvider
  const address = useUserAddress(userProvider);

  // You can warn the user if you would like them to be on a specific network
  const selectedChainId = userProvider && userProvider._network && userProvider._network.chainId;

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
    if (connectWalletRef) {
      const provider = await web3Modal.connect();
      setInjectedProvider(new Web3Provider(provider));
    }
    connectWalletRef.current = true;
  }, [setInjectedProvider]);

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [userRole, setUserRole] = useState(null);
  const [connectedBuilder, setConnectedBuilder] = useState(null);

  const fetchUserData = useCallback(async () => {
    console.log("getting user data");
    try {
      const fetchedUserObject = await axios.get(serverUrl + `/user`, {
        params: { address },
      });
      setUserRole(USER_ROLES[fetchedUserObject.data.role] ?? USER_ROLES.registered);
      setConnectedBuilder(fetchedUserObject.data);
    } catch (e) {
      setUserRole(USER_ROLES.anonymous);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchUserData();
    }
  }, [address, fetchUserData]);

  return (
    <BlockchainProvidersContext.Provider value={providers}>
      <div className="App">
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
            <HomeView connectedBuilder={connectedBuilder} userProvider={userProvider} />
          </Route>
          <Route exact path="/portfolio">
            {address && <Redirect to={"/builders/" + address} />}
          </Route>
          <Route path="/builders" exact>
            <BuilderListView serverUrl={serverUrl} mainnetProvider={mainnetProvider} userRole={userRole} />
          </Route>
          <Route path="/builders/:builderAddress">
            <BuilderProfileView
              serverUrl={serverUrl}
              mainnetProvider={mainnetProvider}
              address={address}
              userRole={userRole}
              userProvider={userProvider}
              fetchUserData={fetchUserData}
            />
          </Route>
          <Route path="/challenge/:challengeId">
            <ChallengeDetailView
              serverUrl={serverUrl}
              address={address}
              userProvider={userProvider}
              userRole={userRole}
              loadWeb3Modal={loadWeb3Modal}
            />
          </Route>
          {/* ToDo: Protect this route on the frontend? */}
          <Route path="/submission-review" exact>
            <SubmissionReviewView userProvider={userProvider} mainnetProvider={mainnetProvider} />
          </Route>
          <Route path="/activity" exact>
            <ActivityView />
          </Route>
          <Route path="/404" exact>
            <NotFoundView />
          </Route>
          <Route path="*">
            <Redirect to="/404" />
          </Route>
        </Switch>
        <ColorModeSwitcher />
      </div>
      <SiteFooter />
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
