import React from "react";
import { Switch, Route } from "react-router-dom";
import { Router } from "react-router";

import Search from "views/screens/search";
import Variant from "views/screens/variant";
import history from "utils/history";
import Layout from "components/Layout";
import RouteWrapper from "./RouteWrapper";

const AppRouter = (): React.ReactElement => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/search">
          <Search />
        </Route>
        <Route exact path="/variant/:patientid">
          <Variant />
        </Route>
        <RouteWrapper
          exact
          path="/variant/entity/:hash"
          component={() => <>Variant Entity</>}
          layout={Layout}
        />
      </Switch>
    </Router>
  );
};

export default AppRouter;
