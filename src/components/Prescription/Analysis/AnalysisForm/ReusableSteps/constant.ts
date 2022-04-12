export enum STEPS_ID {
  PATIENT_IDENTIFICATION = 'patient',
  CLINICAL_SIGNS = 'clinical_signs',
  HISTORY_AND_DIAGNOSIS = 'history_and_diagnosis',
  PARACLINICAL_EXAMS = 'paraclinical_exams',
  SUBMISSION = 'submission',
}

export const EMPTY_FIELD = '--';

export const defaultFormItemsRules = [{ required: true, validateTrigger: 'onSumbit' }];
