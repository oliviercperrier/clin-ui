import { GlobalInitialState } from 'store/global';
import { TReportState } from './reports';

export type RootState = {
  global: GlobalInitialState;
  report: TReportState;
};
