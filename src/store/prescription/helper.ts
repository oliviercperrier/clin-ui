import { AnalysisType, MuscularAnalysisType } from './types';

export const isMuscularAnalysis = (analysis: AnalysisType) =>
  Object.values(MuscularAnalysisType).includes(analysis as MuscularAnalysisType);

export const isMuscularAnalysisAndNotGlobal = (analysis: AnalysisType) =>
  isMuscularAnalysis(analysis) &&
  (analysis as MuscularAnalysisType) !== MuscularAnalysisType.MUSCULAR_DISEASE_GLOBAL;