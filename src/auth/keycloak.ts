import Keycloak from 'keycloak-js';
import { keycloakConfig } from 'utils/config';

const keycloak = Keycloak(keycloakConfig);

export default keycloak;

export const logout = () => (
    keycloak.logout()
)
