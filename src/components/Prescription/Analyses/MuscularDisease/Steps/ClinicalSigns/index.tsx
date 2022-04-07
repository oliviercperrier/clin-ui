import { Form, Input } from 'antd';
import AnalysisForm from 'components/Prescription/Analyses/AnalysisForm';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';


const ClinicalSigns = (props: IAnalysisStepForm) => {
  const FORM_KEY = props.formName;
  const [form] = Form.useForm();

  return (
    <AnalysisForm form={form} name={FORM_KEY}>
      <Form.Item name="test" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </AnalysisForm>
  );
};

export default ClinicalSigns;
