import { createAsyncThunk } from '@reduxjs/toolkit';
import { ReportTranscriptsApi } from 'api/reportTranscripts';
import { downloadFile } from 'utils/helper';
import { notification } from 'antd';
import { Rpt } from 'auth/types';
import intl from 'react-intl-universal';
import capitalize from 'lodash/capitalize';
import { MIME_TYPES } from 'utils/constants';

const extractFilename = (contentDisposition: string = '') => {
  const split = contentDisposition.split(';');
  const filenameEntry = split.find((e) => e?.startsWith(' filename=')) || '';
  return filenameEntry.split('=')?.[1] || '';
};

const fetchTranscriptsReport = createAsyncThunk<
  void,
  { rpt: Rpt; patientId: string; variantId: string }
>('report/fetchReport', async ({ rpt, patientId, variantId }) => {
  try {
    const r = await ReportTranscriptsApi.fetchReport(rpt, patientId, variantId);
    const { data, response } = r;
    const headers = response.headers;
    const filename = extractFilename(headers['content-disposition']) || `${patientId}_transcripts`;
    const blob = new Blob([data as BlobPart], { type: MIME_TYPES.APPLICATION_XLSX });
    downloadFile(blob, filename);
    notification.success({
      message: capitalize(intl.get('notification.success')),
      description: intl.get('screen.patientvariant.drawer.download.report.notification.success'),
    });
  } catch (e) {
    notification.error({
      message: capitalize(intl.get('notification.error')),
      description: intl.get('screen.patientvariant.drawer.download.report.notification.error'),
    });
  }
});
export { fetchTranscriptsReport };
