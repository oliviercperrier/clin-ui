import Router from "views/route";
import intl from "react-intl-universal";
import locales from "locales";
// import keycloak from 'auth/keycloak-api/keycloak';
// import { ReactKeycloakProvider } from "@react-keycloak/web";
import { ConfigProvider } from "antd";
import frFR from "antd/lib/locale/fr_FR";
import { LANG } from "utils/constants";

import "style/themes/clin/main.scss";
import "style/themes/clin/dist/antd.css";

const App = () => {
  intl.init({
    currentLocale: LANG.FR,
    locales: { [LANG.FR]: locales[LANG.FR] },
  });

  return (
    <ConfigProvider locale={LANG.FR ? frFR : undefined}>
      <div className="App">
        <Router />
      </div>
    </ConfigProvider>
  );
};

export default App;
