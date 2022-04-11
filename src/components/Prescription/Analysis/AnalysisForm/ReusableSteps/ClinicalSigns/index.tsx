import { Form } from 'antd';
import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import ClinicalSignsSelect, {
  IClinicalSignsDataType,
} from 'components/Prescription/components/ClinicalSignsSelect';
import { usePrescriptionForm } from 'store/prescription';
import { STEPS_ID } from '../constant';

export type TClinicalSignsDataType = IClinicalSignsDataType;

const ClinicalSigns = ({}: IAnalysisStepForm) => {
  const FORM_NAME = STEPS_ID.CLINICAL_SIGNS;
  const [form] = Form.useForm();
  const { analysisData } = usePrescriptionForm();

  const getInitialData = () =>
    analysisData ? (analysisData[FORM_NAME] as IClinicalSignsDataType) : undefined;

  return (
    <AnalysisForm layout="horizontal" form={form} name={FORM_NAME}>
      <ClinicalSignsSelect form={form} parentKey={FORM_NAME} initialData={getInitialData()} />
    </AnalysisForm>
  );
};

export default ClinicalSigns;
