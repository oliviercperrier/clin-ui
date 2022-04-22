import { Button, Tooltip } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';
import { PrescriptionResult } from 'graphql/prescriptions/models/Prescription';

import { FileTextOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { reportSelector } from 'store/reports/selectors';
import { useRpt } from 'hooks/rpt';
import { fetchNanuqSequencingReport } from 'store/reports/thunks';

interface Props {
  selectedPrescription: PrescriptionResult[];
}

const NanuqExportButton = ({ selectedPrescription }: Props): React.ReactElement => {
  const dispatch = useDispatch();
  const { rpt } = useRpt();
  const { isLoadingNanuqSequencing: isLoadingReport } = useSelector(reportSelector);
  return (
    <Tooltip title={intl.get('screen.patientsearch.table.nanuq.tootip')}>
      <Button
        loading={isLoadingReport}
        disabled={!selectedPrescription.length || !rpt}
        size="small"
        type="link"
        icon={<FileTextOutlined height="14" width="14" />}
        onClick={() => {
          dispatch(
            fetchNanuqSequencingReport({
              rpt,
              srIds: selectedPrescription.map((sp) => sp.id),
            }),
          );
        }}
      >
        {intl.get('screen.patientsearch.table.nanuq')}
      </Button>
    </Tooltip>
  );
};

export default NanuqExportButton;
