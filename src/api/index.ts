import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const apiInstance = axios.create();

interface ApiResponse<T> {
  data: T | undefined;
  response: AxiosResponse;
  error: AxiosError | undefined;
}

//copied from Include project.
export const sendRequest = async <T>(config: AxiosRequestConfig) =>
  apiInstance
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
