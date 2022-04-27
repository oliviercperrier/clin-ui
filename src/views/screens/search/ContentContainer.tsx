import React from 'react';
import intl from 'react-intl-universal';
import { Space, Tabs } from 'antd';
import { MedicineBoxFilled } from '@ant-design/icons';
import { ic_people } from 'react-icons-kit/md';
import IconKit from 'react-icons-kit';
import { GqlResults } from 'graphql/models';
import { ExtendedMappingResults } from 'graphql/models';
import { PatientResult } from 'graphql/patients/models/Patient';
import { PrescriptionResult } from 'graphql/prescriptions/models/Prescription';
import PatientsTable from './table/PatientsTable';
import PrescriptionsTable from './table/PrescriptionsTable';
import ContentHeader from './ContentHeader';

import "./ContentContainer.scss";

const { TabPane } = Tabs;

export enum TableTabs {
  Patients = 'patients',
  Prescriptions = 'prescriptions',
}
export type PrescriptionResultsContainerProps = {
  prescriptions: GqlResults<PrescriptionResult>;
  extendedMapping: ExtendedMappingResults;
  patients: GqlResults<PatientResult> | null;
  searchResults: GqlResults<PatientResult> | null;
  isLoading?: boolean;
  tabs: {
    currentTab: TableTabs;
    setCurrentTab: (t: TableTabs) => void;
  };
};

const ContentContainer = ({
  patients,
  prescriptions,
  searchResults,
  tabs,
  isLoading = false,
}: PrescriptionResultsContainerProps): React.ReactElement => (
  <Space direction="vertical" size="middle" className="content-container">
    <ContentHeader searchResults={searchResults} />
    <Tabs onChange={(v) => tabs.setCurrentTab(v as TableTabs)} type="card">
      <TabPane
        key={TableTabs.Prescriptions}
        tab={
          <>
            <MedicineBoxFilled />
            {intl.get('screen.patient.tab.prescriptions')}{' '}
            {prescriptions?.total && ` (${prescriptions?.total})`}
          </>
        }
      >
        <PrescriptionsTable results={prescriptions} loading={isLoading} />
      </TabPane>
      <TabPane
        key={TableTabs.Patients}
        tab={
          <>
            <IconKit icon={ic_people} />
            {intl.get('header.navigation.patient')} {patients?.total && ` (${patients?.total})`}
          </>
        }
      >
        <PatientsTable results={patients} loading={isLoading} />
      </TabPane>
    </Tabs>
  </Space>
);

export default ContentContainer;
