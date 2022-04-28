import { TCollapseProps } from '@ferlab/ui/core/components/Collapse';
import { ValidateMessages } from 'rc-field-form/lib/interface';

export enum STEPS_ID {
  PATIENT_IDENTIFICATION = 'patient',
  CLINICAL_SIGNS = 'clinical_signs',
  HISTORY_AND_DIAGNOSIS = 'history_and_diagnosis',
  PARACLINICAL_EXAMS = 'paraclinical_exams',
  SUBMISSION = 'submission',
  MOTHER_IDENTIFICATION = 'mother',
  FATHER_IDENTIFICATION = 'father',
  ADD_PARENT_SUBMISSION = 'add_parent_submission',
}

export const EMPTY_FIELD = '--';

export const defaultFormItemsRules = [{ required: true, validateTrigger: 'onSumbit' }];

export const defaultValidateMessages: ValidateMessages = {
  required: 'Ce champs est obligatoire',
};
export const defaultCollapseProps: TCollapseProps = {
  size: 'small',
  arrowIcon: 'caretFilled',
  bordered: false,
  theme: 'shade',
};
