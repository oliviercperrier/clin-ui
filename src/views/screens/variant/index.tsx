import React from 'react';

import VariantSearchPage from 'views/screens/variant/VariantSearchPage';
import { GraphqlBackend } from 'store/providers';
import ApolloProvider from 'store/providers/apollo';

const SearchScreen = (): React.ReactElement => (
  <ApolloProvider backend={GraphqlBackend.ARRANGER}>
    <VariantSearchPage />
  </ApolloProvider>
);
export default SearchScreen;
