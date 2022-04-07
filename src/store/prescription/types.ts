export type initialState = {
  analysisChoiceVisible: boolean;
  prescriptionVisible: boolean;
  currentFormSubmitRef?: Function;
  currentStep?: IAnalysisStep;
  analysisType?: AnalysisType;
  config?: IAnalysisConfig;
  analysisData: any; // TODO add type for each Analysis Data Type
};

// TODO Probably change with backend values??
export enum MuscularAnalysisType {
  MUSCULAR_DISEASE_GLOBAL = 'muscular_global_panel',
  MUSCULAR_DISEASE_DYSTROPHIES = 'muscular_dystrophies',
  MUSCULAR_DISEASE_MALIGNANT_HYPERTHERMIA = 'muscular_malignant_hyperthermia',
  MUSCULAR_DISEASE_CONGENITAL_MYASTHENIA = 'muscular_congenital_myasthenia',
  MUSCULAR_DISEASE_CONGENITAL_MYOPATHIES = 'muscular_congenital_myopathies',
  MUSCULAR_DISEASE_RHABDOMYOLYSIS = 'muscular_rhabdomyolysis',
}

export enum OtherAnalysisType {
  GLOBAL_DEVELOPMENTAL_DELAY = 'developmental_delay',
  NUCLEAR_MITOCHONDRIOPATHY = 'nuclear_mitochondriopathy',
}

export type AnalysisType = MuscularAnalysisType | OtherAnalysisType;

export interface ICompleteAnalysisChoice {
  type: AnalysisType;
  extraData: any;
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
