import React from "react";
import { Link } from "react-router-dom";
import { Account } from "./index";

// displays a page header

export default function Header({
  injectedProvider,
  userRoles,
  userRole,
  address,
  web3Modal,
  mainnetProvider,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  setUserRole,
  blockExplorer,
}) {
  const isSignerProviderConnected =
    injectedProvider && injectedProvider.getSigner && injectedProvider.getSigner()._isSigner;

  return (
    <>
      <a href="/">scaffold directory</a>
      <ul style={{ textAlign: "center", marginBottom: "25px" }}>
        <li key="/">
          <Link to="/">Home</Link>
        </li>
        <li key="/builders">
          <Link to="/builders">All Builders</Link>
        </li>
        {isSignerProviderConnected && (
          <li key="/my-profile">
            <Link to="/my-profile">My profile</Link>
          </li>
        )}
        {userRoles.admin === userRole && (
          <li key="/challenge-review">
            <Link to="/challenge-review">Review Challenges</Link>
          </li>
        )}
      </ul>

      <div style={{ textAlign: "center", padding: 10 }}>
        <Account
          connectText="Connect Ethereum Wallet"
          onlyShowButton={!isSignerProviderConnected}
          address={address}
          mainnetProvider={mainnetProvider}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={() => {
            logoutOfWeb3Modal();
            setUserRole(userRoles.anonymous);
          }}
          blockExplorer={blockExplorer}
          isAdmin={userRole === userRoles.admin}
        />
      </div>
    </>
  );
}
