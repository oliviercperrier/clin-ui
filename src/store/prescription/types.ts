import { STEPS_ID } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { IAnalysisDataType } from 'components/Prescription/Analysis/stepMapping';
import { ValidateFields } from 'rc-field-form/lib/interface';

export type initialState = {
  analysisChoiceModalVisible: boolean;
  addParentModalVisible: boolean;
  prescriptionVisible: boolean;
  currentFormRefs?: ICurrentFormRefs;
  currentStep?: IAnalysisStep;
  analysisType?: AnalysisType;
  config?: IAnalysisConfig;
  analysisData: IAnalysisDataType; // TODO add type for each Analysis Data Type
  lastStepIsNext?: boolean;
  isAddingParent?: boolean;
};

export interface ICurrentFormRefs {
  sumbit: () => void;
  validateFields: ValidateFields;
  getFieldsValue: () => any;
}

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

export interface IStartAddingParent {
  selectedAnalysis: any; // Will need to match to backend data model
  stepId: STEPS_ID.FATHER_IDENTIFICATION | STEPS_ID.MOTHER_IDENTIFICATION;
}

export interface IAnalysisConfig {
  analysisTitle: string;
  steps: IAnalysisStep[];
}

export interface IAnalysisStep {
  title: string;
  id: STEPS_ID;
  index?: number;
  previousStepIndex?: number;
  nextStepIndex?: number;
}
