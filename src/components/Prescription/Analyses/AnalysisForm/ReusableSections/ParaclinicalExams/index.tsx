import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import AnalysisForm from 'components/Prescription/Analyses/AnalysisForm';
import { Form } from 'antd';
import { usePrescriptionForm } from 'store/prescription';
import ParaclinicalExamsSelect, {
  IParaclinicalExamsDataType,
} from 'components/Prescription/components/ParaclinicalExamsSelect';

const ParaclinicalExams = (props: IAnalysisStepForm) => {
  const FORM_NAME = props.formName;
  const [form] = Form.useForm();
  const { analysisData } = usePrescriptionForm();

  const getInitialData = () =>
    analysisData ? (analysisData[FORM_NAME] as IParaclinicalExamsDataType) : undefined;

  return (
    <AnalysisForm layout="horizontal" form={form} name={FORM_NAME}>
      <ParaclinicalExamsSelect form={form} parentKey={FORM_NAME} initialData={getInitialData()} />
    </AnalysisForm>
  );
};

export default ParaclinicalExams;
