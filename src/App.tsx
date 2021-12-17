import Router from 'views/route';
import intl from 'react-intl-universal';
import locales from 'locales';
// import keycloak from 'auth/keycloak-api/keycloak';
// import { ReactKeycloakProvider } from "@react-keycloak/web";
import { ConfigProvider } from 'antd';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import frFR from 'antd/lib/locale/fr_FR';
import enUS from 'antd/lib/locale/en_US';
import { LANG } from 'utils/constants';
import getStoreConfig from 'store';
import { useGlobals } from 'store/global';

const { store, persistor } = getStoreConfig();
persistor.subscribe(function () {
  intl.init({
    currentLocale: store.getState().global.lang || LANG.EN,
    locales,
  });
});

const App = () => {
  const { lang } = useGlobals();
  return (
    <ConfigProvider locale={lang === LANG.FR ? frFR : enUS}>
      <div className="App">
        <Router />
      </div>
    </ConfigProvider>
  );
};

const AppWrapper = () => (
  <ReduxProvider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </ReduxProvider>
);

export default AppWrapper;
