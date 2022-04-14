import ClinicalSigns, { TClinicalSignsDataType } from './AnalysisForm/ReusableSteps/ClinicalSigns';
import ClinicalSignsReview from './AnalysisForm/ReusableSteps/ClinicalSigns/Review';
import { STEPS_ID } from './AnalysisForm/ReusableSteps/constant';
import HistoryAndDiagnosticHypothesis, {
  THistoryAndDiagnosisDataType,
} from './AnalysisForm/ReusableSteps/HistoryAndDiagnosticHypothesis';
import HistoryAndDiagnosisReview from './AnalysisForm/ReusableSteps/HistoryAndDiagnosticHypothesis/Review';
import ParaclinicalExams, {
  TParaclinicalExamsDataType,
} from './AnalysisForm/ReusableSteps/ParaclinicalExams';
import ParaclinicalExamsReview from './AnalysisForm/ReusableSteps/ParaclinicalExams/Review';
import ParentIdentification from './AnalysisForm/ReusableSteps/ParentIdentification';
import ParentIdentificationReview from './AnalysisForm/ReusableSteps/ParentIdentification/Review';
import PatientIdentification, {
  TPatientFormDataType,
} from './AnalysisForm/ReusableSteps/PatientIdentification';
import PatientIdentificationReview from './AnalysisForm/ReusableSteps/PatientIdentification/Review';
import Submission from './AnalysisForm/ReusableSteps/Submission';

export const stepsMapping = {
  [STEPS_ID.PATIENT_IDENTIFICATION]: <PatientIdentification />,
  [STEPS_ID.CLINICAL_SIGNS]: <ClinicalSigns />,
  [STEPS_ID.PARACLINICAL_EXAMS]: <ParaclinicalExams />,
  [STEPS_ID.HISTORY_AND_DIAGNOSIS]: <HistoryAndDiagnosticHypothesis />,
  [STEPS_ID.MOTHER_IDENTIFICATION]: <ParentIdentification key="mother" parent="mother" />,
  [STEPS_ID.FATHER_IDENTIFICATION]: <ParentIdentification key="father" parent="father" />,
  [STEPS_ID.SUBMISSION]: <Submission />,
};

export const submissionStepMapping = {
  [STEPS_ID.PATIENT_IDENTIFICATION]: <PatientIdentificationReview />,
  [STEPS_ID.CLINICAL_SIGNS]: <ClinicalSignsReview />,
  [STEPS_ID.PARACLINICAL_EXAMS]: <ParaclinicalExamsReview />,
  [STEPS_ID.HISTORY_AND_DIAGNOSIS]: <HistoryAndDiagnosisReview />,
  [STEPS_ID.MOTHER_IDENTIFICATION]: <ParentIdentificationReview key="mother" parent="mother" />,
  [STEPS_ID.FATHER_IDENTIFICATION]: <ParentIdentificationReview key="father" parent="father" />,
  [STEPS_ID.SUBMISSION]: <></>,
};

export interface IAnalysisDataType {
  [STEPS_ID.PATIENT_IDENTIFICATION]?: TPatientFormDataType;
  [STEPS_ID.CLINICAL_SIGNS]?: TClinicalSignsDataType;
  [STEPS_ID.PARACLINICAL_EXAMS]?: TParaclinicalExamsDataType;
  [STEPS_ID.HISTORY_AND_DIAGNOSIS]?: THistoryAndDiagnosisDataType;
  [STEPS_ID.MOTHER_IDENTIFICATION]?: any;
  [STEPS_ID.FATHER_IDENTIFICATION]?: any;
  [STEPS_ID.SUBMISSION]?: any;
}

export type IAnalysisStepDataType =
  | TPatientFormDataType
  | TClinicalSignsDataType
  | TParaclinicalExamsDataType
  | THistoryAndDiagnosisDataType;
