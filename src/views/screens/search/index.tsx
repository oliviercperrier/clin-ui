import React from 'react';
import { Layout } from 'antd';

import { GraphqlBackend } from 'providers';
import ApolloProvider from 'providers/apollo';

import PatientsPrescriptions from 'views/screens/search/PatientsPrescriptions';
import PrescriptionForm from 'components/Prescription';
import AnalysisChoice from 'components/Prescription/AnalysisChoice';

const { Content } = Layout;

const SearchScreen = (): React.ReactElement => (
  <Layout>
    <Content>
      <ApolloProvider backend={GraphqlBackend.ARRANGER}>
        <PatientsPrescriptions />
        <AnalysisChoice />
        <PrescriptionForm />
      </ApolloProvider>
    </Content>
  </Layout>
);

export default SearchScreen;
