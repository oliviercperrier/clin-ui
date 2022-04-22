import { createSlice } from '@reduxjs/toolkit';
import { TReportState } from 'store/reports/types';
import { fetchNanuqSequencingReport, fetchTranscriptsReport } from 'store/reports/thunks';

export const ReportState: TReportState = {
  isLoadingPatientTranscripts: false,
  isLoadingNanuqSequencing: false,
};

const reportSlice = createSlice({
  name: 'report',
  initialState: ReportState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTranscriptsReport.pending, (state) => {
      state.isLoadingPatientTranscripts = true;
    });
    builder.addCase(fetchTranscriptsReport.rejected, (state) => {
      state.isLoadingPatientTranscripts = false;
    });
    builder.addCase(fetchTranscriptsReport.fulfilled, (state) => {
      state.isLoadingPatientTranscripts = false;
    });
    builder.addCase(fetchNanuqSequencingReport.pending, (state) => {
      state.isLoadingNanuqSequencing = true;
    });
    builder.addCase(fetchNanuqSequencingReport.rejected, (state) => {
      state.isLoadingNanuqSequencing = false;
    });
    builder.addCase(fetchNanuqSequencingReport.fulfilled, (state) => {
      state.isLoadingNanuqSequencing = false;
    });
  },
});

export const reportActions = reportSlice.actions;
export default reportSlice.reducer;
