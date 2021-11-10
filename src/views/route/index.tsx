import React from 'react';
import {
  Switch,
  Route,
} from "react-router-dom";
import { Router } from 'react-router';
import { history } from "configureStore"

import Search from 'views/screens/search';
import Variant from 'views/screens/variant';

const AppRouter = (): React.ReactElement => {
  return (
    <Router history={history}>
        <Switch>
          <Route path="/search/:token">
              <Search />
          </Route>
          <Route path="/variant">
              <Variant />
          </Route>
        </Switch>
    </Router>
  );
}

export default AppRouter