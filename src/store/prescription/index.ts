import { STEPS_ID } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { useSelector } from 'react-redux';
import { prescriptionSelector } from './selector';

export type { initialState as PrescriptionInitialState } from './types';
export { default, PrescriptionState } from './slice';
export const usePrescriptionForm = () => useSelector(prescriptionSelector)