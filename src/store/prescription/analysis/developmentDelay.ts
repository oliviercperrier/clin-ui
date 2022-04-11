import { STEPS_ID } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';

export const DevelopmentDelayConfig = {
  analysisTitle: 'Retard global de développement / Déficience intellectuelle',
  steps: [
    {
      id: STEPS_ID.PATIENT_IDENTIFICATION,
      title: 'Identification du patient',
    },
    {
      id: STEPS_ID.CLINICAL_SIGNS,
      title: 'Signes cliniques',
    },
    {
      id: STEPS_ID.PARACLINICAL_EXAMS,
      title: 'Examens paracliniques',
    },
    {
      id: STEPS_ID.HISTORY_AND_DIAGNOSIS,
      title: 'Histoire et hypothèse diagnostique',
    },
    {
      id: STEPS_ID.SUBMISSION,
      title: 'Soumission',
    },
  ],
};
