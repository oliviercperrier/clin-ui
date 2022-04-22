import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Tooltip } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { fetchTranscriptsReport } from 'store/reports/thunks';
import { reportSelector } from 'store/reports/selectors';

type Props = {
  patientId: string;
  variantId: string;
};

const ReportDownloadButton = ({ patientId, variantId }: Props) => {
  const dispatch = useDispatch();
  const { isLoadingPatientTranscripts: isLoadingReport } = useSelector(reportSelector);
  return (
    <Tooltip title={intl.get('screen.patientvariant.drawer.download.report.tooltip')}>
      <Button
        disabled={isLoadingReport}
        loading={isLoadingReport}
        icon={<DownloadOutlined />}
        onClick={() => dispatch(fetchTranscriptsReport({ patientId, variantId }))}
      >
        {intl.get('screen.patientvariant.drawer.download.report')}
      </Button>
    </Tooltip>
  );
};

export default ReportDownloadButton;
