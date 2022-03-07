import { createSlice } from '@reduxjs/toolkit';
import { TReportState } from 'store/reports/types';
import { fetchTranscriptsReport } from 'store/reports/thunks';

export const ReportState: TReportState = {
  isLoading: false,
};

const reportSlice = createSlice({
  name: 'report',
  initialState: ReportState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTranscriptsReport.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchTranscriptsReport.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(fetchTranscriptsReport.fulfilled, (state, action) => {
      state.isLoading = false;
    });
  },
});

export const reportActions = reportSlice.actions;
export default reportSlice.reducer