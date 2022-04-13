export type Rpt = string;
export type DecodedRpt = {
  exp: number;
  iat: number;
  auth_time: number;
  iss: string;
  authorization: {
    permissions: {
      rsid: string;
      rsname: string;
    }[];
  };
};
export interface IRptPayload {
  decoded: DecodedRpt;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}
