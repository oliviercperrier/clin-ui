import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isUndefined } from 'lodash';
import {
  AnalysisType,
  IAnalysisStep,
  initialState,
  ICompleteAnalysisChoice,
} from 'store/prescription/types';
import { MuscularDiseaseConfig } from './analysis/muscular';

export const PrescriptionState: initialState = {
  prescriptionVisible: false,
  analysisChoiceVisible: false,
  currentStep: undefined,
  config: undefined,
  analysisData: {},
};

export const AnalysisConfigMapping = {
  [AnalysisType.MUSCULAR_DISEASE]: MuscularDiseaseConfig,
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
    saveStepData: (state, action: PayloadAction<any>) => {
      state.analysisData = {
        ...state.analysisData,
        ...action.payload,
      };
    },
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
    cancel: (state) => ({
      ...PrescriptionState,
    }),
    startAnalyseChoice: (state) => {
      state.analysisChoiceVisible = true;
    },
    completeAnalysisChoice: (state, action: PayloadAction<ICompleteAnalysisChoice>) => {
      let config = AnalysisConfigMapping[action.payload.type];

      config = {
        ...config,
        steps: enrichSteps(config.steps),
      };

      state.analysisType = action.payload.type;
      state.analysisChoiceVisible = false;
      state.prescriptionVisible = true;
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
