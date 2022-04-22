import { keycloakConfig } from 'utils/config';
import jwtDecode from 'jwt-decode';
import { sendRequest } from 'api';
import { DecodedRpt, IRptPayload } from './types';

const KEYCLOAK_AUTH_GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:uma-ticket';
export const RPT_TOKEN_URL = `${keycloakConfig.url}realms/clin/protocol/openid-connect/token`;
const CLOSE_TO_EXPIRE_TIME = 300; // 5 minutes in seconds

const rptPayload = new URLSearchParams({
  grant_type: KEYCLOAK_AUTH_GRANT_TYPE,
  audience: keycloakConfig.authClientId,
}).toString();

export const fetchRptToken = async (): Promise<IRptPayload> => {
  const { data } = await sendRequest<IRptPayload>({
    method: 'POST',
    url: RPT_TOKEN_URL,
    data: rptPayload,
  });
  return {
    ...data!,
    decoded: decodeRptAccess(data!),
  };
};

export const decodeRptAccess = (rpt: IRptPayload): DecodedRpt => jwtDecode(rpt.access_token);

const tokenStatus = (iat: number, expires_in: number) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = iat + expires_in;

  return {
    expired: currentTime > expirationTime,
    closeToExpire: expirationTime - currentTime <= CLOSE_TO_EXPIRE_TIME,
  };
};

export const getAccessTokenStatus = (rpt: IRptPayload) =>
  tokenStatus(rpt.decoded.iat, rpt.expires_in);

export class RptManager {
  private static storedRpt?: IRptPayload;

  private static async requestNewRpt() {
    return fetchRptToken();
  }

  private static async readRptFromStorage() {
    if (this.storedRpt == null) {
      this.storedRpt = await this.requestNewRpt();
    }

    return this.storedRpt;
  }

  public static async readRpt(): Promise<IRptPayload> {
    const rpt = await this.readRptFromStorage();
    const status = getAccessTokenStatus(rpt);

    if (!status.expired) {
      return rpt;
    }

    return this.requestNewRpt();
  }
}
