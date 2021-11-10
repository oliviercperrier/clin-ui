import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Search from 'views/screens/search';
import Variant from 'views/screens/variant';

const AppRouter = (): React.ReactElement => {
  return (
    <Router>
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