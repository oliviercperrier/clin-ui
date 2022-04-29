import Router from 'views/route';
import intl from 'react-intl-universal';
import locales from 'locales';
import keycloak from 'auth/keycloak';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { ConfigProvider } from 'antd';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import frFR from 'antd/lib/locale/fr_FR';
import enUS from 'antd/lib/locale/en_US';
import { LANG } from 'utils/constants';
import getStoreConfig from 'store';
import { useGlobals } from 'store/global';
import { useKeycloak } from '@react-keycloak/web';
import Spinner from 'components/uiKit/Spinner';
import { useEffect } from 'react';
import Empty from '@ferlab/ui/core/components/Empty';

const { store, persistor } = getStoreConfig();

persistor.subscribe(function () {
  intl.init({
    currentLocale: store.getState().global.lang || LANG.EN,
    locales,
    warningHandler: () => '',
  });
});

const App = () => {
  const { lang } = useGlobals();
  const { keycloak, initialized } = useKeycloak();
  const keycloakIsReady = keycloak && initialized;

  useEffect(() => {
    const showLogin = keycloakIsReady && !keycloak.authenticated;
    if (showLogin) {
      keycloak.login();
    }
  }, [keycloakIsReady, keycloak]);

  return (
    <ConfigProvider
      locale={lang === LANG.FR ? frFR : enUS}
      renderEmpty={() => <Empty imageType="grid" description={intl.get('no.data.available')} />}
    >
      <div className="App">{keycloakIsReady ? <Router /> : <Spinner size="small" />}</div>
    </ConfigProvider>
  );
};

const AppWrapper = () => (
  <ReactKeycloakProvider authClient={keycloak}>
    <ReduxProvider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </ReduxProvider>
  </ReactKeycloakProvider>
);

export default AppWrapper;
