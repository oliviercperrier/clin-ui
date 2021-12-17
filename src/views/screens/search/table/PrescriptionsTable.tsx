import { Button, message } from 'antd';
import React, { useState } from 'react';
import { prescriptionsColumns } from './prescriptionColumns';
import Table, { Props } from './Table';
import DocumentIcon from 'components/icons/DocumentIcon';
import { PrescriptionResult } from 'store/graphql/prescriptions/models/Prescription';
import { generateAndDownloadNanuqExport, getTopBodyElement } from 'utils/helper';
import intl from 'react-intl-universal';

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
        <Button
          disabled={!selectedPrescription.length}
          size="small"
          type="link"
          icon={<DocumentIcon height="14" width="14" />}
          onClick={() => {
            generateAndDownloadNanuqExport(selectedPrescription);
            message.success({
              content: intl.get('report.nanuq.success'),
              getPopupContainer: () => getTopBodyElement()
            });
          }}
        >
          Nanuq
        </Button>
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
