import React, { useState } from 'react';
import intl from 'react-intl-universal';
import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { mappedFilters, usePatients } from 'graphql/patients/actions';
import { usePrescription, usePrescriptionMapping } from 'graphql/prescriptions/actions';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { TableTabs } from './ContentContainer';
import ContentContainer from './ContentContainer';
import Sidebar from './Sidebar';
import ContentHeader from 'components/Layout/Content/Header';
import { Space } from 'antd';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';

import styles from './PatientsPrescriptions.module.scss';

export const MAX_NUMBER_RESULTS = 1000;
export const PRESCRIPTION_QB_ID = 'prescription-repo';

const PrescriptionSearch = (): React.ReactElement => {
  const [currentTab, setCurrentTab] = useState(TableTabs.Prescriptions);
  const { queryList, activeQuery } = useQueryBuilderState(PRESCRIPTION_QB_ID);

  const newFilters = mappedFilters(activeQuery);
  const patientQueryConfig = {
    first: MAX_NUMBER_RESULTS,
    offset: 0,
    sqon: resolveSyntheticSqon(queryList, newFilters),
    sort: [
      {
        field: 'timestamp',
        order: 'desc',
      },
    ],
  };

  const searchResults = usePatients(patientQueryConfig);
  const patients = usePatients(patientQueryConfig);

  const arrangerQueryConfig = {
    first: MAX_NUMBER_RESULTS,
    offset: 0,
    sqon: resolveSyntheticSqon(queryList, activeQuery),
    sort: [
      {
        field: 'timestamp',
        order: 'desc',
      },
    ],
  };

  const prescriptions = usePrescription(arrangerQueryConfig);
  const extendedMapping = usePrescriptionMapping();

  return (
    <Space className={styles.layout} direction="vertical" size={0}>
      <ContentHeader title={intl.get('screen.patientsearch.title')} />
      <div className={styles.pageWrapper}>
        <Sidebar
          queryBuilderId={PRESCRIPTION_QB_ID}
          isLoading={prescriptions.loading}
          aggregations={prescriptions.aggregations}
          extendedMapping={extendedMapping}
          filters={activeQuery as ISqonGroupFilter}
        />
        <ScrollContent className={styles.scrollContent}>
          <ContentContainer
            isLoading={prescriptions.loading}
            extendedMapping={extendedMapping}
            patients={patients}
            prescriptions={prescriptions}
            searchResults={searchResults}
            tabs={{
              currentTab,
              setCurrentTab,
            }}
          />
        </ScrollContent>
      </div>
    </Space>
  );
};

export default PrescriptionSearch;
