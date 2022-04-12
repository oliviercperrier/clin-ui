import { keycloakConfig } from 'utils/config';
import jwtDecode from 'jwt-decode';
import { ApiResponse, sendRequest } from 'api';
import { IRptPayload } from './types';

const KEYCLOAK_AUTH_GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:uma-ticket';
export const RPT_TOKEN_URL = `${keycloakConfig.url}realms/clin/protocol/openid-connect/token`;

const rptPayload = new URLSearchParams({
  grant_type: KEYCLOAK_AUTH_GRANT_TYPE,
  audience: keycloakConfig.authClientId,
}).toString();

export const fetchRptToken = () =>
  sendRequest<IRptPayload>({
    method: 'POST',
    url: RPT_TOKEN_URL,
    data: rptPayload,
  });

export const decodeRptAccess = (rptResponse: ApiResponse<IRptPayload>): string =>
  jwtDecode(rptResponse.data!.access_token);
