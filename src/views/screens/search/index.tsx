import React from 'react';
import {
  useParams
} from "react-router-dom";

import { GraphqlBackend } from 'store/providers';
import ApolloProvider from 'store/providers/apollo';

import PatientsPrescriptions from './PatientsPrescriptions';
import 'style/themes/clin/dist/antd.css';

const SearchScreen = (): React.ReactElement => {
  const { token }: { token: string } = useParams();
  return (
    <ApolloProvider backend={GraphqlBackend.ARRANGER} token={token}>
      <PatientsPrescriptions />
    </ApolloProvider>
  )
}
export default SearchScreen;
