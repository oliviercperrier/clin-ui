import { IAnalysisConfig } from 'store/prescription/types';
import ClinicalSigns from './AnalysisForm/ReusableSteps/ClinicalSigns';
import { STEPS_ID } from './AnalysisForm/ReusableSteps/constant';
import HistoryAndDiagnosticHypothesis from './AnalysisForm/ReusableSteps/HistoryAndDiagnosticHypothesis';
import ParaclinicalExams from './AnalysisForm/ReusableSteps/ParaclinicalExams';
import PatientIdentification from './AnalysisForm/ReusableSteps/PatientIdentification';
import Submission from './AnalysisForm/ReusableSteps/Submission';

export const stepsMapping = {
  [STEPS_ID.PATIENT_IDENTIFICATION]: <PatientIdentification />,
  [STEPS_ID.CLINICAL_SIGNS]: <ClinicalSigns />,
  [STEPS_ID.PARACLINICAL_EXAMS]: <ParaclinicalExams />,
  [STEPS_ID.HISTORY_AND_DIAGNOSIS]: <HistoryAndDiagnosticHypothesis />,
  [STEPS_ID.SUBMISSION]: <Submission />,
};
