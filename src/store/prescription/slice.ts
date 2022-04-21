import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isUndefined } from 'lodash';
import {
  AnalysisType,
  IAnalysisStep,
  initialState,
  ICompleteAnalysisChoice,
  ICurrentFormRefs,
  IStartAddingParent,
  IAnalysisConfig,
} from 'store/prescription/types';
import { getAddParentSteps } from './analysis/addParent';
import { DevelopmentDelayConfig } from './analysis/developmentDelay';
import { MuscularDiseaseConfig } from './analysis/muscular';
import { isMuscularAnalysis, isMuscularAnalysisAndNotGlobal } from './helper';

export const PrescriptionState: initialState = {
  prescriptionVisible: false,
  addParentModalVisible: false,
  analysisChoiceModalVisible: false,
  currentStep: undefined,
  config: undefined,
  analysisData: {},
};

export const getAnalysisConfigMapping = (type: AnalysisType) => {
  if (isMuscularAnalysis(type)) {
    return MuscularDiseaseConfig;
  } else {
    return DevelopmentDelayConfig; // TODO
  }
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
    goTo: (
      state,
      action: PayloadAction<{
        index: number;
        lastStepIsNext?: boolean;
      }>,
    ) => {
      state.currentStep = state.config?.steps[action.payload.index];
      state.lastStepIsNext = action.payload.lastStepIsNext;
    },
    goToLastStep: (state) => {
      state.currentStep = state.config?.steps[state.config?.steps.length - 1];
      state.lastStepIsNext = false;
    },
    nextStep: (state) => {
      const nextStepIndex = state.currentStep?.nextStepIndex;
      if (!isUndefined(nextStepIndex)) {
        state.currentStep = state.config?.steps[nextStepIndex];
      }
    },
    previousStep: (state) => {
      const previousStepIndex = state.currentStep?.previousStepIndex;

      if (state.currentFormRefs?.getFieldsValue) {
        state.analysisData = {
          ...state.analysisData,
          ...state.currentFormRefs.getFieldsValue(),
        };
      }

      if (!isUndefined(previousStepIndex)) {
        state.currentStep = state.config?.steps[previousStepIndex];
      }
    },
    cancel: (state) => ({
      ...PrescriptionState,
    }),
    startAddParentChoice: (state) => {
      state.addParentModalVisible = true;
      state.isAddingParent = true;
    },
    completeAddParentChoice: (state, action: PayloadAction<IStartAddingParent>) => {
      const config: IAnalysisConfig = {
        analysisTitle: '',
        steps: enrichSteps(getAddParentSteps(action.payload.stepId)),
      };

      state.config = config;
      state.currentStep = config.steps[0];
      state.addParentModalVisible = false;
      state.prescriptionVisible = true;
    },
    startAnalyseChoice: (state) => {
      state.analysisChoiceModalVisible = true;
    },
    completeAnalysisChoice: (state, action: PayloadAction<ICompleteAnalysisChoice>) => {
      let config = getAnalysisConfigMapping(action.payload.type)!;

      config = {
        ...config,
        steps: enrichSteps(config.steps),
      };

      if (isMuscularAnalysisAndNotGlobal(action.payload.type)) {
        state.analysisData = action.payload.extraData;
      }

      state.analysisType = action.payload.type;
      state.analysisChoiceModalVisible = false;
      state.prescriptionVisible = true;
      state.currentStep = config.steps[0];
      state.config = config;
    },
    currentFormRefs: (state, action: PayloadAction<ICurrentFormRefs>) => {
      state.currentFormRefs = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const prescriptionFormActions = prescriptionFormSlice.actions;
export const prescriptionFormActionTypes = Object.values(prescriptionFormActions).map(
  (action) => action.type,
);
export default prescriptionFormSlice.reducer;
