export enum MuscularDiseaseFormName {
  PATIENT_IDENTIFICATION = 'patient',
  CLINICAL_SIGNS = 'clinical_signs',
  PARACLINICAL_EXAMS = 'paraclinical_exams',
  DIAGNOSTIC_HYPOTHESIS = 'diagnostic_hypothesis',
  SUBMISSION = 'submission',
}

export interface IMuscularDiseaseAnalyseData {}

export const MuscularDiseaseConfig = {
  analysisTitle: 'Maladies musculaires',
  steps: [
    {
      formName: MuscularDiseaseFormName.PATIENT_IDENTIFICATION,
      title: 'Identification du patient',
    },
    {
      formName: MuscularDiseaseFormName.CLINICAL_SIGNS,
      title: 'Signes cliniques',
    },
    {
      formName: MuscularDiseaseFormName.PARACLINICAL_EXAMS,
      title: 'Examens paracliniques',
    },
    {
      formName: MuscularDiseaseFormName.DIAGNOSTIC_HYPOTHESIS,
      title: 'Histoire et hypothèse diagnostique',
    },
    {
      formName: MuscularDiseaseFormName.SUBMISSION,
      title: 'Soumission',
    },
  ],
};

// PATIENT_IDENTIFICATION STEP

// CLINICAL_SIGNS STEP

// PARACLINICAL_EXAMS STEP

// DIAGNOSTIC_HYPOTHESIS STEP

// SUBMISSION STEP
