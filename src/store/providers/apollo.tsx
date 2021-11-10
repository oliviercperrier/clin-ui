import { ReactElement } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import get from 'lodash/get'
import { GraphqlBackend, GraphqlProvider } from 'store/providers';
import { getAccessTokenStatus } from 'auth/keycloak-api/utils';

const ARRANGER_API = get(window, 'CLIN.arrangerBaseUrl', process.env.REACT_APP_ARRANGER_API)
const PROJECT_ID = get(window, 'CLIN.arrangerProjectId', process.env.REACT_APP_ARRANGER_PROJECT_ID)
const FHIR_API = get(window, 'CLIN.fhirBaseUrl', process.env.REACT_APP_FHIR_SERVICE_URL)

const fhirLink = createHttpLink({
  uri: `${FHIR_API}/$graphql`,
});

const arrangerLink = createHttpLink({
  uri: `${ARRANGER_API}/${PROJECT_ID}/graphql`,
});

const getAuthLink = (token: string) => (
  setContext((_, { headers }) => (
      {
        headers: {
          ...headers,
          authorization: `Bearer "${getAccessTokenStatus}"`
        },
      }
  ))
);

const backendUrl = (backend: GraphqlBackend) => (
  backend === GraphqlBackend.FHIR ? fhirLink : arrangerLink
);

type Token = {
  token: string;
}

const Provider = ({ children, backend = GraphqlBackend.FHIR, token }: GraphqlProvider & Token): ReactElement => {
  const header = getAuthLink(token);

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache: new InMemoryCache({ addTypename: false }),
    link: header.concat(backendUrl(backend)),
  });
  return <ApolloProvider client={client}>{ children }</ApolloProvider>;
};

export default Provider;
