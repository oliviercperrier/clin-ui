import { ReactKeycloakProvider } from '@react-keycloak/web';
import Router from 'views/route';
// import keycloak from 'auth/keycloak-api/keycloak';

import './App.css';
import 'style/themes/clin/dist/antd.css';
import 'style/themes/clin/main.scss';

function App() {
  return (
    <div className="App">
      <Router />
    </div>
  );
}

export default App;
