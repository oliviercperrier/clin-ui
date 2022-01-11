import React, { useState } from 'react';
import { prescriptionsColumns } from './prescriptionColumns';
import Table, { Props } from './Table';
import { PrescriptionResult } from 'store/graphql/prescriptions/models/Prescription';
import NanuqExportButton from './NanuqExportButton';

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE = 1;


const PrescriptionsTable = ({ results, loading = false }: Props): React.ReactElement => {
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionResult[]>([]);
  const [currentPageSize, setcurrentPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const columns = prescriptionsColumns([]);
  return (
    <Table
      columns={columns}
      loading={loading}
      pagination={{
        current: currentPage,
        defaultPageSize: currentPageSize,
        onChange: (page, pageSize) => {
          if (currentPage !== page || currentPageSize !== pageSize) {
            setCurrentPage(page);
            setcurrentPageSize(pageSize || DEFAULT_PAGE_SIZE);
          }
        },
      }}
      results={results}
      total={results?.total || 0}
      extra={
        <NanuqExportButton selectedPrescription={selectedPrescription} /> 
      }
      rowSelection={{
        type: 'checkbox',
        onChange: (_, value: PrescriptionResult[]) => {
          setSelectedPrescription(value);
        },
      }}
    />
  );
};

export default PrescriptionsTable;
