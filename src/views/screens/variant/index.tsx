import React from "react";
import useQueryString from "utils/useQueryString";

import VariantSearchPage from "views/screens/variant/VariantSearchPage";
import { GraphqlBackend } from "store/providers";
import ApolloProvider from "store/providers/apollo";

const SearchScreen = (): React.ReactElement => {
  const { token } = useQueryString();

  return (
    <ApolloProvider backend={GraphqlBackend.ARRANGER} token={token as string}>
      <VariantSearchPage />
    </ApolloProvider>
  );
};
export default SearchScreen;
