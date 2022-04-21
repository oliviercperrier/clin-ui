import { STEPS_ID } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { IAnalysisStep } from '../types';

const getAddParentStepTitle = (stepId: STEPS_ID) => {
  switch (stepId) {
    case STEPS_ID.FATHER_IDENTIFICATION:
      return 'Information du père';
    case STEPS_ID.MOTHER_IDENTIFICATION:
      return 'Information de la mère';
    default:
      return 'Information du parent';
  }
};

export const getAddParentSteps = (stepId: STEPS_ID): IAnalysisStep[] => [
  {
    id: stepId,
    title: getAddParentStepTitle(stepId),
  },
  {
    id: STEPS_ID.ADD_PARENT_SUBMISSION,
    title: 'Soumission',
  },
];
