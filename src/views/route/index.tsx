import React from 'react';
import {
  Switch,
  Route,
} from "react-router-dom";
import { Router } from 'react-router';

import Search from 'views/screens/search';
import Variant from 'views/screens/variant';
import history from 'utils/history';

const AppRouter = (): React.ReactElement => {
  return (
    <Router history={history}>
        <Switch>
          <Route path="/search">
              <Search />
          </Route>
          <Route path="/variant/:patientid">
              <Variant />
          </Route>
        </Switch>
    </Router>
  );
}

export default AppRouter