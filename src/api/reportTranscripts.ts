import { sendRequestWithRpt } from 'api';
import { Rpt } from 'auth/types';
import { getEnvVariable } from 'utils/config';
import { MIME_TYPES } from 'utils/constants';

const ARRANGER_API = getEnvVariable('ARRANGER_API');

const fetchReport = (rpt: Rpt, patientId: string, variantId: string) =>
  sendRequestWithRpt({
    url: `${ARRANGER_API}/report/transcripts/${encodeURIComponent(patientId)}/${encodeURIComponent(
      variantId,
    )}`,
    headers: {
      'Content-Type': MIME_TYPES.APPLICATION_XLSX,
    },
    responseType: 'arraybuffer',
    method: 'GET',
  });

export const ReportTranscriptsApi = {
  fetchReport,
};
