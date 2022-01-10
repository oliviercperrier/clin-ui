import { Button, message, Tooltip, Modal } from 'antd';
import React, { useState } from 'react';
import { prescriptionsColumns } from './prescriptionColumns';
import Table, { Props } from './Table';
import { PrescriptionResult } from 'store/graphql/prescriptions/models/Prescription';
import { generateAndDownloadNanuqExport, getTopBodyElement } from 'utils/helper';
import intl from 'react-intl-universal';
import { FileTextOutlined } from '@ant-design/icons';
import { getNanuqModalConfigs } from './NanuqModal';

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE = 1;
const ACTIVE_STATUS = 'active';

const handleGenerateExportNanuq = (selectedPrescription: PrescriptionResult[]) => {
  if (selectedPrescription.find((p: PrescriptionResult) => p.status !== ACTIVE_STATUS)) {
    Modal.error(getNanuqModalConfigs());
  } else {
    generateAndDownloadNanuqExport(selectedPrescription);
    message.success({
      content: intl.get('report.nanuq.success'),
      getPopupContainer: () => getTopBodyElement(),
    });
  }
};

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
        <Tooltip title={intl.get('screen.patientsearch.table.nanuq.tootip')}>
          <Button
            disabled={!selectedPrescription.length}
            size="small"
            type="link"
            icon={<FileTextOutlined height="14" width="14" />}
            onClick={() => {
              handleGenerateExportNanuq(selectedPrescription);
            }}
          >
            {intl.get('screen.patientsearch.table.nanuq')}
          </Button>
        </Tooltip>
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
