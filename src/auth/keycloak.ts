import Keycloak from 'keycloak-js';
import { keycloakConfig } from 'utils/config';

const keycloak = Keycloak(keycloakConfig);

export const getFhirPractitionerId = () =>
  keycloak.tokenParsed ? keycloak.tokenParsed.fhir_practitioner_id : undefined;

export default keycloak;

export const logout = () => (
    keycloak.logout()
)
