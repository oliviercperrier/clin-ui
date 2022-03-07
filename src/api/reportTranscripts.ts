import { sendRequest } from 'api';
import { appendBearerIfToken } from 'utils/helper';
import { Rpt } from 'auth/types';
import { getEnvVariable } from 'utils/config';
import { MIME_TYPES } from 'utils/constants';

const ARRANGER_API = getEnvVariable('ARRANGER_API');

const fetchReport = (rpt: Rpt, patientId: string, variantId: string) =>
  sendRequest({
    url: `${ARRANGER_API}/report/transcripts/${encodeURIComponent(patientId)}/${encodeURIComponent(
      variantId,
    )}`,
    headers: {
      Authorization: appendBearerIfToken(rpt),
      'Content-Type': MIME_TYPES.APPLICATION_XLSX,
    },
    responseType: 'arraybuffer',
    method: 'GET',
  });

export const ReportTranscriptsApi = {
  fetchReport,
};
