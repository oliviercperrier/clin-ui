import { Form } from 'antd';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import { usePrescriptionForm } from 'store/prescription';
import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import HistoryAndDiagnosticData, {
  IHistoryAndDiagnosisDataType,
} from 'components/Prescription/components/HistoryAndDiagnosisData';
import { STEPS_ID } from '../constant';

export type THistoryAndDiagnosisDataType = IHistoryAndDiagnosisDataType;

const HistoryAndDiagnosticHypothesis = ({}: IAnalysisStepForm) => {
  const FORM_NAME = STEPS_ID.HISTORY_AND_DIAGNOSIS;
  const [form] = Form.useForm();
  const { analysisData } = usePrescriptionForm();

  const getInitialData = () => (analysisData ? analysisData[FORM_NAME] : undefined);

  return (
    <AnalysisForm layout="horizontal" form={form} name={FORM_NAME}>
      <HistoryAndDiagnosticData parentKey={FORM_NAME} form={form} initialData={getInitialData()} />
    </AnalysisForm>
  );
};

export default HistoryAndDiagnosticHypothesis;
