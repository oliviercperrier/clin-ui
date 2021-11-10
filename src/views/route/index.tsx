import React from 'react';
import {
  Router,
} from "react-router";


import {
  Switch,
  Route,
} from "react-router-dom";

import Search from 'views/screens/search';
import Variant from 'views/screens/variant';
import history from 'utils/history';

const AppRouter = (): React.ReactElement => {
  return (
      <Router history={history}>
          <Switch>
            <Route path="/search/:token">
                <Search />
            </Route>
            <Route path="/variant/:token">
                <Variant />
            </Route>
          </Switch>
      </Router>
  );
}

export default AppRouter