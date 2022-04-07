export type initialState = {
  analysisChoiceVisible: boolean;
  prescriptionVisible: boolean;
  currentFormSubmitRef?: Function;
  currentStep?: IAnalysisStep;
  analysisType?: AnalysisType;
  config?: IAnalysisConfig;
  analysisData: any; // TODO add type for each Analysis Data Type
};

export enum AnalysisType {
  MUSCULAR_DISEASE = 'muscular',
}

export interface ICompleteAnalysisChoice {
  type: AnalysisType;
}

export interface IAnalysisConfig {
  analysisTitle: string;
  steps: IAnalysisStep[];
}

export interface IAnalysisStep {
  title: string;
  formName: any;
  index?: number;
  previousStepIndex?: number;
  nextStepIndex?: number;
}
