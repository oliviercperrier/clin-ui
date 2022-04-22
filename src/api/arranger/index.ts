import { ARRANGER_API_PROJECT_URL } from 'providers/apollo';
import { sendRequest } from 'api';

const graphqlRequest = <T = any>(data: { query: any; variables: any }) =>
  sendRequest<T>({
    method: 'POST',
    url: ARRANGER_API_PROJECT_URL,
    data,
  });

export const ArrangerApi = {
  graphqlRequest,
};
