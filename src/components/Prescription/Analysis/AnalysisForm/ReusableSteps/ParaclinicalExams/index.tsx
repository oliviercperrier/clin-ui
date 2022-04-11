import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import { Form } from 'antd';
import { usePrescriptionForm } from 'store/prescription';
import ParaclinicalExamsSelect, {
  IParaclinicalExamsDataType,
} from 'components/Prescription/components/ParaclinicalExamsSelect';
import { STEPS_ID } from '../constant';

export type TParaclinicalExamsDataType = IParaclinicalExamsDataType;

const ParaclinicalExams = ({}: IAnalysisStepForm) => {
  const FORM_NAME = STEPS_ID.PARACLINICAL_EXAMS;
  const [form] = Form.useForm();
  const { analysisData } = usePrescriptionForm();

  const getInitialData = () => analysisData ? analysisData[FORM_NAME] : undefined;

  return (
    <AnalysisForm layout="horizontal" form={form} name={FORM_NAME}>
      <ParaclinicalExamsSelect form={form} parentKey={FORM_NAME} initialData={getInitialData()} />
    </AnalysisForm>
  );
};

export default ParaclinicalExams;
