import { Button, message } from 'antd';
import React, { useState } from 'react';
import { prescriptionsColumns } from './prescriptionColumns';
import Table, { Props } from './Table';
import DocumentIcon from 'components/icons/DocumentIcon';
import { PrescriptionResult } from 'store/graphql/prescriptions/models/Prescription';
import { generateAndDownloadNanuqExport } from 'utils/helper';
import intl from "react-intl-universal";

const PrescriptionsTable = ({ results, loading = false }: Props): React.ReactElement => {
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const columns = prescriptionsColumns([]);

  return (
    <Table
      columns={columns}
      loading={loading}
      pagination={{
        current: currentPage,
        onChange: (page, _pageSize) => setCurrentPage(page),
      }}
      results={results}
      total={results?.total || 0}
      extra={
        <Button
          size="small"
          type="link"
          icon={<DocumentIcon height="14" width="14" />}
          onClick={() => {
            generateAndDownloadNanuqExport(selectedPrescription)
            message.success(intl.get("report.nanuq.success"))
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
