import keycloak from 'auth/keycloak';
import { RptManager } from 'auth/rpt';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const apiInstance = axios.create();

export interface ApiResponse<T> {
  data: T | undefined;
  response: AxiosResponse;
  error: AxiosError | undefined;
}

apiInstance.interceptors.request.use((config) => {
  const token = keycloak?.token;
  config.headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...config.headers,
  };

  return config;
});

const rptApiInstance = axios.create({
  timeout: 15000,
});

rptApiInstance.interceptors.request.use(async (config) => {
  const rpt = await RptManager.readRpt();
  config.headers = {
    ...(rpt && { Authorization: `Bearer ${rpt.access_token}` }),
    ...config.headers,
  };

  return config;
});

export const sendRequestWithRpt = async <T>(config: AxiosRequestConfig) =>
  makeRequest<T>(rptApiInstance, config);

export const sendRequest = async <T>(config: AxiosRequestConfig) =>
  makeRequest<T>(apiInstance, config);

export const makeRequest = async <T>(instance: AxiosInstance, config: AxiosRequestConfig) =>
  instance
    .request<T>(config)
    .then(
      (response): ApiResponse<T> => ({
        response: response,
        data: response.data,
        error: undefined,
      }),
    )
    .catch(
      (err): ApiResponse<T> => ({
        response: err.response,
        data: undefined,
        error: err,
      }),
    );

export default apiInstance;
export { rptApiInstance };
