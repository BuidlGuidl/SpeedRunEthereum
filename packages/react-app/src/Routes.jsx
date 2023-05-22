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
import useUrlLang from "./hooks/useUrlLang";

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
  const { langUrlPrefix, path } = useUrlLang();
  // INFO: pathPrefix is the path without trailing `/`
  const pathPrefix = path.replace(/\/$/, "");

  return (
    <Switch>
      <Route exact path={path}>
        <HomeView connectedBuilder={connectedBuilder} userProvider={userProvider} />
      </Route>
      <Route exact path={`${pathPrefix}/portfolio`}>
        {address && <Redirect to={`${langUrlPrefix}/builders/${address}`} />}
      </Route>
      <Route path={`${pathPrefix}/builders`} exact>
        <BuilderListView serverUrl={serverUrl} mainnetProvider={mainnetProvider} userRole={userRole} />
      </Route>
      <Route path={`${pathPrefix}/builders/:builderAddress`}>
        <BuilderProfileView
          serverUrl={serverUrl}
          mainnetProvider={mainnetProvider}
          address={address}
          userRole={userRole}
          userProvider={userProvider}
          fetchUserData={fetchUserData}
        />
      </Route>
      <Route path={`${pathPrefix}/challenge/:challengeId`}>
        <ChallengeDetailView
          serverUrl={serverUrl}
          address={address}
          userProvider={userProvider}
          userRole={userRole}
          loadWeb3Modal={loadWeb3Modal}
        />
      </Route>
      {/* ToDo: Protect this route on the frontend? */}
      <Route path={`${pathPrefix}/submission-review`} exact>
        <SubmissionReviewView userProvider={userProvider} mainnetProvider={mainnetProvider} />
      </Route>
      <Route path={`${pathPrefix}/activity`} exact>
        <ActivityView />
      </Route>
    </Switch>
  );
};

export default Routes;
