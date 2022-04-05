export type initialState = {
  modalVisible: boolean;
  currentFormSubmitRef?: Function;
  currentStep?: IAnalysisStep;
  analysisType?: AnalysisType;
  config?: IAnalysisConfig;
};

export enum AnalysisType {
  MUSCULAR_DISEASE = "muscular",
}

export interface IStartPrescription {
  type: AnalysisType;
}

export interface IAnalysisConfig {
  analysisTitle: string;
  steps: IAnalysisStep[];
}

export interface IAnalysisStep {
  index: number;
  title: string;
  previousStepIndex?: number;
  nextStepIndex?: number;
}
