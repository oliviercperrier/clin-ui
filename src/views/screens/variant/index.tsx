import React from 'react';
import {
  useParams
} from "react-router-dom";

import { GraphqlBackend } from 'store/providers';
import ApolloProvider from 'store/providers/apollo';

const SearchScreen = (): React.ReactElement => {
  const { token }: { token: string } = useParams();

  return (<ApolloProvider backend={GraphqlBackend.ARRANGER} token={token}>
      <h1>Hello</h1>
  </ApolloProvider>);
}
export default SearchScreen;
