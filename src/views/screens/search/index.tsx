import React from "react";

import { GraphqlBackend } from "store/providers";
import ApolloProvider from "store/providers/apollo";

import PatientsPrescriptions from "./PatientsPrescriptions";
import "style/themes/clin/dist/antd.css";
import useQueryString from "utils/useQueryString";

const SearchScreen = (): React.ReactElement => {
  const { token } = useQueryString();

  return (
    <ApolloProvider backend={GraphqlBackend.ARRANGER} token={token as string}>
        <PatientsPrescriptions />
    </ApolloProvider>
  );
};

export default SearchScreen;
