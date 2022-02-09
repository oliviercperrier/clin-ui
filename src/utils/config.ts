export const getEnvVariable = (envVarName: string) =>
  (process.env[`REACT_APP_${envVarName}`] || '') as string;

const stringyKeycloakConfig = getEnvVariable('KEYCLOAK_CONFIG');

export const keycloakConfig = JSON.parse(stringyKeycloakConfig);

export const bridgeOrigin = getEnvVariable('BRIDGE_ORIGIN');
