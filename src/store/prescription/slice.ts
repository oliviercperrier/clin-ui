import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isUndefined } from 'lodash';
import {
  AnalysisType,
  IAnalysisStep,
  initialState,
  IStartPrescription,
} from 'store/prescription/types';

export const PrescriptionState: initialState = {
  modalVisible: false,
  currentStep: undefined,
  config: undefined,
};

export const AnalysisConfigMapping = {
  [AnalysisType.MUSCULAR_DISEASE]: {
    analysisTitle: 'Maladies musculaires',
    steps: [
      {
        formName: 'patient',
        title: 'Identification du patient',
      },
      {
        formName: 'clinical_signs',
        title: 'Signes cliniques',
      },
      {
        formName: 'paraclinical_exams',
        title: 'Examens paracliniques',
      },
      {
        formName: 'diagnostic_hypothesis',
        title: 'Histoire et hypothèse diagnostique',
      },
      {
        formName: 'submission',
        title: 'Soumission',
      },
    ],
  },
};

const enrichSteps = (steps: IAnalysisStep[]): IAnalysisStep[] =>
  steps.map((step, index) => ({
    ...step,
    index,
    previousStepIndex: index > 0 ? index - 1 : undefined,
    nextStepIndex: index < steps.length - 1 ? index + 1 : undefined,
  }));

const prescriptionFormSlice = createSlice({
  name: 'prescriptionForm',
  initialState: PrescriptionState,
  reducers: {
    cancelPrescription: (state) => ({
      ...PrescriptionState,
    }),
    goTo: (state, action: PayloadAction<number>) => {
      state.currentStep = state.config?.steps[action.payload];
    },
    nextStep: (state) => {
      const nextStepIndex = state.currentStep?.nextStepIndex;
      if (!isUndefined(nextStepIndex)) {
        state.currentStep = state.config?.steps[nextStepIndex];
      }
    },
    previousStep: (state) => {
      const previousStepIndex = state.currentStep?.previousStepIndex;
      if (!isUndefined(previousStepIndex)) {
        state.currentStep = state.config?.steps[previousStepIndex];
      }
    },
    startPrescription: (state, action: PayloadAction<IStartPrescription>) => {
      let config = AnalysisConfigMapping[action.payload.type];
      config = {
        ...config,
        steps: enrichSteps(config.steps),
      };

      state.analysisType = action.payload.type;
      state.modalVisible = true;
      state.currentStep = config.steps[0];
      state.config = config;
    },
    currentFormSubmitRef: (state, action: PayloadAction<Function>) => {
      state.currentFormSubmitRef = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const prescriptionFormActions = prescriptionFormSlice.actions;
export const prescriptionFormActionTypes = Object.values(prescriptionFormActions).map(
  (action) => action.type,
);
export default prescriptionFormSlice.reducer;
