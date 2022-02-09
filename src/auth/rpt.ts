import { keycloakConfig } from 'utils/config';
import { AxiosInstance, AxiosResponse } from 'axios';
import jwtDecode from 'jwt-decode';

const KEYCLOAK_AUTH_GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:uma-ticket';

const rptPayload = new URLSearchParams({
  grant_type: KEYCLOAK_AUTH_GRANT_TYPE,
  audience: keycloakConfig.authClientId,
}).toString();

export const rptRequest = async (axiosInstance: AxiosInstance) =>
  await axiosInstance.post(
    `${keycloakConfig.url}realms/clin/protocol/openid-connect/token`,
    rptPayload,
  );

export const decodeRptAccess = (rptResponse: AxiosResponse): string =>
  jwtDecode(rptResponse.data.access_token);
