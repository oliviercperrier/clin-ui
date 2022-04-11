import { FormInstance } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import * as React from 'react';

export interface AnalysisFormContextProps {
  form: FormInstance;
  name: string;
  getNamePath: (key: string) => NamePath;
}

const AnalysisFormContext = React.createContext<AnalysisFormContextProps | null>(null);

export const AnalysisFormContextProvider = AnalysisFormContext.Provider;
export const AnalysisFormContextConsumer = AnalysisFormContext.Consumer;

export default AnalysisFormContext;
