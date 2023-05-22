import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import {
  ActivityView,
  BuilderListView,
  BuilderProfileView,
  ChallengeDetailView,
  HomeView,
  SubmissionReviewView,
} from "./views";
import { SUPPORTED_LANGS } from "./helpers/constants";

const Routes = ({
  connectedBuilder,
  userProvider,
  address,
  serverUrl,
  mainnetProvider,
  userRole,
  fetchUserData,
  loadWeb3Modal,
}) => {
  return (
    <Switch>
      <Route exact path="/">
        {({ match }) => <HomeView connectedBuilder={connectedBuilder} userProvider={userProvider} match={match} />}
      </Route>
      <Route exact path="/portfolio">
        {address && <Redirect to={`/builders/${address}`} />}
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
      <Route path={`/:lang(${SUPPORTED_LANGS.join("|")})`}>
        {({ match: { path, url } }) => (
          <Switch>
            <Route exact path={path}>
              {({ match }) => (
                <HomeView connectedBuilder={connectedBuilder} userProvider={userProvider} match={match} />
              )}
            </Route>
            <Route exact path={`${path}/portfolio`}>
              {address && <Redirect to={`${url}/builders/${address}`} />}
            </Route>
            <Route path={`${path}/builders`} exact>
              <BuilderListView serverUrl={serverUrl} mainnetProvider={mainnetProvider} userRole={userRole} />
            </Route>
            <Route path={`${path}/builders/:builderAddress`}>
              <BuilderProfileView
                serverUrl={serverUrl}
                mainnetProvider={mainnetProvider}
                address={address}
                userRole={userRole}
                userProvider={userProvider}
                fetchUserData={fetchUserData}
              />
            </Route>
            <Route path={`${path}/challenge/:challengeId`}>
              <ChallengeDetailView
                serverUrl={serverUrl}
                address={address}
                userProvider={userProvider}
                userRole={userRole}
                loadWeb3Modal={loadWeb3Modal}
              />
            </Route>
            {/* ToDo: Protect this route on the frontend? */}
            <Route path={`${path}/submission-review`} exact>
              <SubmissionReviewView userProvider={userProvider} mainnetProvider={mainnetProvider} />
            </Route>
            <Route path={`${path}/activity`} exact>
              <ActivityView />
            </Route>
          </Switch>
        )}
      </Route>
    </Switch>
  );
};

export default Routes;
