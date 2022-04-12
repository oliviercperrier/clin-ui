import { GlobalInitialState } from 'store/global';
import { TReportState } from 'store/reports';
import { PrescriptionInitialState } from 'store/prescription';
import { TUserState } from 'store/user';

export type RootState = {
  global: GlobalInitialState;
  report: TReportState;
  prescription: PrescriptionInitialState;
  user: TUserState;
};
