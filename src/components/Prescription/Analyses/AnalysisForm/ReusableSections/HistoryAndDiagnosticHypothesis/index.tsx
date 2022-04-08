import { Form } from 'antd';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import { usePrescriptionForm } from 'store/prescription';
import AnalysisForm from 'components/Prescription/Analyses/AnalysisForm';
import { getNamePath } from 'components/Prescription/utils/form';
import HistoryAndDiagnosticData, {
  IHistoryAndDiagnosisDataType,
} from 'components/Prescription/components/HistoryAndDiagnosisData';

const HistoryAndDiagnosticHypothesis = (props: IAnalysisStepForm) => {
  const FORM_NAME = props.formName;
  const [form] = Form.useForm();
  const { analysisData } = usePrescriptionForm();

  const getName = (...key: string[]) => getNamePath(FORM_NAME, key);

  const getInitialData = () =>
    analysisData ? (analysisData[FORM_NAME] as IHistoryAndDiagnosisDataType) : undefined;

  return (
    <AnalysisForm layout="horizontal" form={form} name={FORM_NAME}>
      <HistoryAndDiagnosticData parentKey={FORM_NAME} form={form} initialData={getInitialData()} />
    </AnalysisForm>
  );
};

export default HistoryAndDiagnosticHypothesis;
