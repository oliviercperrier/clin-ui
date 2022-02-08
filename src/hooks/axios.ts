import { useKeycloak } from '@react-keycloak/web';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { appendBearerIfToken } from 'utils/helper';
import { useRef } from 'react';

export const useAxiosBasicWithAuth = (config?: AxiosRequestConfig): AxiosInstance => {
  const { keycloak } = useKeycloak();
  const configOrDefault = config ?? {};
  const axiosInstance = axios.create({
    ...configOrDefault,
    headers: {
      ...(configOrDefault.headers || {}),
      Authorization: appendBearerIfToken(keycloak.token),
    },
  });
  return useRef(axiosInstance).current;
};
