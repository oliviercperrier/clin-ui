import ProTable from '@ferlab/ui/core/components/ProTable';
import { GqlResults } from 'graphql/models';
import { ITablePatientResult, PatientResult } from 'graphql/patients/models/Patient';
import React, { useState } from 'react';
import { getProTableDictionary } from 'utils/translation';
import { patientsColumns } from './patientsColumns';

interface OwnProps {
  results: GqlResults<PatientResult> | null;
  total?: number;
  extra?: React.ReactElement;
  loading?: boolean;
}

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE = 1;

const PatientsTable = ({ results, loading = false }: OwnProps): React.ReactElement => {
  const [currentPageSize, setcurrentPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

  return (
    <ProTable<ITablePatientResult>
      tableId="patient_table"
      columns={patientsColumns()}
      dataSource={results?.data.map((i) => ({ ...i, key: i.id }))}
      loading={loading}
      dictionary={getProTableDictionary()}
      onChange={({ current, pageSize }) => {
        if (currentPage !== current || currentPageSize !== pageSize) {
          setCurrentPage(current!);
          setcurrentPageSize(pageSize || DEFAULT_PAGE_SIZE);
        }
      }}
      headerConfig={{
        itemCount: {
          pageIndex: currentPage,
          pageSize: currentPageSize,
          total: results?.total || 0,
        },
      }}
      size="small"
      pagination={{
        current: currentPage,
        pageSize: currentPageSize,
        defaultPageSize: DEFAULT_PAGE_SIZE,
        total: results?.total ?? 0,
      }}
    />
  );
};

export default PatientsTable;
