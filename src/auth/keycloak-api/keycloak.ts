import Keycloak from 'keycloak-js';
import { keycloakConfig } from 'utils/config';

const keyCloakConfig = JSON.parse(keycloakConfig);
const keycloak = Keycloak(keyCloakConfig);

export default keycloak;
