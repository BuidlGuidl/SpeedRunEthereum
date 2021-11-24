import React, { useCallback, useEffect, useState } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import { Web3Provider, StaticJsonRpcProvider, InfuraProvider } from "@ethersproject/providers";
import "./App.css";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {
  useUserAddress,
  useUserProviderAndSigner,
  useBalance,
  useContractLoader,      
} from "eth-hooks";
import axios from "axios";
import { useUserProvider, useGasPrice } from "./hooks";
import { Header, ColorModeSwitcher } from "./components";
import { NETWORKS, NETWORK, INFURA_ID, SERVER_URL as serverUrl } from "./constants";
import externalContracts from "./contracts/external_contracts";
import deployedContracts from "./contracts/hardhat_contracts.json";
import {
  BuilderListView,
  ChallengeDetailView,
  BuilderProfileView,
  SubmissionReviewView,
  HomeView,
  BuildsListView,
} from "./views";
import { Transactor } from "./helpers";
import { USER_ROLES } from "./helpers/constants";
import { providerPromiseWrapper } from "./helpers/blockchainProviders";
import BlockchainProvidersContext from "./contexts/blockchainProvidersContext";

const { ethers } = require("ethers");

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

// 🛰 providers

    //This code is needed if you want a local and a mainnet provider

    // 📡 What chain are your contracts deployed to?
    const targetNetwork = NETWORKS.matic; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

    // 🏠 Your local provider is usually pointed at your local blockchain
    const localProviderUrl = targetNetwork.rpcUrl;

    // as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
    const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;

    const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

function App() {
  const [providers, setProviders] = useState({
    mainnet: { provider: null, isReady: false },
    local: { provider: null, isReady: false },
  });

  const [injectedProvider, setInjectedProvider] = useState();

  const [signerAddress, setSignerAddress] = useState();

  useEffect(() => {

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

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  // TODO move the userProvider into the "providers" state, which is sent into the BlockchainProvidersContext
  const userProvider = useUserProvider(injectedProvider, localProvider);
  // TODO address is derived from userProvider, so we should just send userProvider
  const address = useUserAddress(userProvider);

  const maticProvider = useUserProviderAndSigner(injectedProvider, localProvider)

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
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  //const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  const gasPrice = useGasPrice(targetNetwork, "fast");

  // The transactor wraps transactions and provides notificiations
   

  // Faucet Tx can be used to send funds from the faucet
  //const faucetTx = Transactor(localProvider, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  //const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  //const yourMainnetBalance = useBalance(mainnetProvider, address);

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:

  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider);

  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setSignerAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(userProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, 137);
  console.log(writeContracts)


  const tx = Transactor(injectedProvider, gasPrice);


  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  //const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

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
            injectedProvider={injectedProvider}
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
