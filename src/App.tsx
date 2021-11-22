import Router from "views/route";
import intl from "react-intl-universal";
import locales from "locales";
// import keycloak from 'auth/keycloak-api/keycloak';
// import { ReactKeycloakProvider } from "@react-keycloak/web";

import "style/themes/clin/main.scss";
import "style/themes/clin/dist/antd.css";
import { LANG } from "utils/constants";

const App = () => {
  intl.init({
    currentLocale: LANG.FR,
    locales: { [LANG.FR]: locales[LANG.FR] },
  });

  return (
    <div className="App">
      <Router />
    </div>
  );
};

export default App;
