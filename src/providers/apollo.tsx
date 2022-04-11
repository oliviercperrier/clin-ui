import { ReactElement } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import get from 'lodash/get';
import { GraphqlBackend, GraphqlProvider } from 'providers/';
import { appendBearerIfToken } from 'utils/helper';
import { useRpt } from 'hooks/rpt';

const ARRANGER_API = get(window, 'CLIN.arrangerBaseUrl', process.env.REACT_APP_ARRANGER_API);
const PROJECT_ID = get(window, 'CLIN.arrangerProjectId', process.env.REACT_APP_ARRANGER_PROJECT_ID);
const FHIR_API = get(window, 'CLIN.fhirBaseUrl', process.env.REACT_APP_FHIR_SERVICE_URL);
export const ARRANGER_API_PROJECT_URL = `${ARRANGER_API}/${PROJECT_ID}/graphql`;

const fhirLink = createHttpLink({
  uri: `${FHIR_API}/$graphql`,
});

const arrangerLink = createHttpLink({
  uri: ARRANGER_API_PROJECT_URL,
});

const getAuthLink = (token: string) =>
  setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: appendBearerIfToken(token),
    },
  }));

const backendUrl = (backend: GraphqlBackend) =>
  backend === GraphqlBackend.FHIR ? fhirLink : arrangerLink;

const Provider = ({ children, backend = GraphqlBackend.FHIR }: GraphqlProvider): ReactElement => {
  const { loading, rpt } = useRpt();
  if (loading) {
    return <></>;
  }
  const header = getAuthLink(rpt);

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache: new InMemoryCache({ addTypename: false }),
    link: header.concat(backendUrl(backend)),
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Provider;
