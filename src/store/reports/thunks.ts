import { createAsyncThunk } from '@reduxjs/toolkit';
import { ReportsApi } from 'api/reports';
import { downloadFile } from 'utils/helper';
import { notification } from 'antd';
import { Rpt } from 'auth/types';
import intl from 'react-intl-universal';
import capitalize from 'lodash/capitalize';
import { MIME_TYPES } from 'utils/constants';
import { ApiResponse } from 'api';
import { v4 as uuid } from 'uuid';

const extractFilename = (contentDisposition: string = '') => {
  const split = contentDisposition.split(';');
  const filenameEntry = split.find((e) => e?.startsWith(' filename=')) || '';
  return filenameEntry.split('=')?.[1] || '';
};

const showErrorNotification = (reportNameI18n: string) =>
  notification.error({
    placement: 'topLeft',
    message: capitalize(intl.get('notification.error')),
    description: `${capitalize(reportNameI18n)} : ${intl.get(
      'report.notification.error.description',
    )}`,
    getContainer: () => window.parent.document.body,
  });

const proceedToDownload = async (
  reportNameI18n: string,
  filenameIfNotFoundInHeaders: string,
  request: Promise<ApiResponse<unknown>>,
) => {
  try {
    const r = await request;
    const { data, response } = r;
    if (!data || !response) {
      return showErrorNotification(reportNameI18n);
    }
    const headers = response.headers;
    const filename = extractFilename(headers['content-disposition']) || filenameIfNotFoundInHeaders;
    const blob = new Blob([data as BlobPart], { type: MIME_TYPES.APPLICATION_XLSX });
    downloadFile(blob, filename);
    notification.success({
      placement: 'topLeft',
      message: capitalize(intl.get('notification.success')),
      description: `${capitalize(reportNameI18n)} : ${intl.get(
        'report.notification.success.description',
      )}`,
      getContainer: () => window.parent.document.body,
    });
  } catch (e) {
    showErrorNotification(reportNameI18n);
  }
};

const fetchTranscriptsReport = createAsyncThunk<
  void,
  { rpt: Rpt; patientId: string; variantId: string }
>('report/fetchTranscriptsReport', async ({ rpt, patientId, variantId }) => {
  await proceedToDownload(
    intl.get('report.name.interpretation'),
    `transcripts_${uuid()}.xlsx`,
    ReportsApi.fetchPatientTranscriptsReport(rpt, patientId, variantId),
  );
});

const fetchNanuqSequencingReport = createAsyncThunk<void, { rpt: Rpt; srIds: string[] }>(
  'report/fetchNanuqSequencingReport',
  async ({ rpt, srIds }) => {
    await proceedToDownload(
      'nanuq',
      `clin_nanuq_${uuid()}.xlsx`,
      ReportsApi.fetchNanuqSequencingReport(rpt, srIds),
    );
  },
);

export { fetchTranscriptsReport, fetchNanuqSequencingReport };
