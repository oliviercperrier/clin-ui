import { ReactKeycloakProvider } from "@react-keycloak/web";
import Router from "views/route";
import intl from "react-intl-universal";
import locales from "locales";
// import keycloak from 'auth/keycloak-api/keycloak';

import "./App.css";
import "style/themes/clin/main.scss";
import "style/themes/clin/dist/antd.css";

function App() {
  intl.init({ currentLocale: "fr", locales: { fr: locales.fr } });

  return (
    <div className="App">
      <Router />
    </div>
  );
}

export default App;
