import { Form } from 'antd';
import AnalysisForm from 'components/Prescription/Analyses/AnalysisForm';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import ClinicalSignsSelect, {
  IClinicalSignsDataType,
} from 'components/Prescription/components/ClinicalSignsSelect';
import { usePrescriptionForm } from 'store/prescription';

const ClinicalSigns = (props: IAnalysisStepForm) => {
  const FORM_NAME = props.formName;
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
