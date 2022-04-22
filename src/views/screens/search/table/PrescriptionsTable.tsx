import React, { useState } from 'react';
import { prescriptionsColumns } from './prescriptionColumns';
import {
  ITablePrescriptionResult,
  PrescriptionResult,
} from 'graphql/prescriptions/models/Prescription';
import NanuqExportButton from './NanuqExportButton';
import ProTable from '@ferlab/ui/core/components/ProTable';
import { GqlResults } from 'graphql/models';
import { getProTableDictionary } from 'utils/translation';

interface OwnProps {
  results: GqlResults<PrescriptionResult> | null;
  total?: number;
  extra?: React.ReactElement;
  loading?: boolean;
}

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE = 1;

const PrescriptionsTable = ({ results, loading = false }: OwnProps): React.ReactElement => {
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionResult[]>([]);
  const [currentPageSize, setcurrentPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

  return (
    <ProTable<ITablePrescriptionResult>
      tableId="prescription_table"
      columns={prescriptionsColumns()}
      dataSource={results?.data.map((i) => ({ ...i, key: i.id }))}
      loading={loading}
      enableRowSelection={true}
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
        onSelectedRowsChange: (keys, rows) => setSelectedPrescription(rows),
        extra: [<NanuqExportButton selectedPrescription={selectedPrescription} />],
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

export default PrescriptionsTable;
