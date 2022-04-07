import { FormInstance } from 'antd';
import { NamePath } from 'antd/lib/form/interface';

export interface IAnalysisStepForm {
  formName: string;
}

export interface IAnalysisFormPart {
  form: FormInstance;
  parentKey?: NamePath;
}
