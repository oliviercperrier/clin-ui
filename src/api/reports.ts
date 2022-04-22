import { sendRequestWithRpt } from 'api';
import { getEnvVariable } from 'utils/config';
import { MIME_TYPES } from 'utils/constants';

const ARRANGER_API = getEnvVariable('ARRANGER_API');

const fetchPatientTranscriptsReport = (patientId: string, variantId: string) =>
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

const fetchNanuqSequencingReport = (srIds: string[]) =>
  sendRequestWithRpt({
    url: `${ARRANGER_API}/report/nanuq/sequencing${
      !!srIds?.length ? `?${srIds.map((id) => `srIds[]=${encodeURIComponent(id)}`).join('&')}` : ''
    }`,
    headers: {
      'Content-Type': MIME_TYPES.APPLICATION_XLSX,
    },
    responseType: 'arraybuffer',
    method: 'GET',
  });

export const ReportsApi = {
  fetchPatientTranscriptsReport,
  fetchNanuqSequencingReport,
};
