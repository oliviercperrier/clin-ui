import { Form, Input } from 'antd';
import AnalysisForm from 'components/Prescription/Analyses/AnalysisForm';

const FORM_PARENT_KEY = 'clinical_signs';

const ClinicalSigns = () => {
  const [form] = Form.useForm();

  return (
    <AnalysisForm
      form={form}
      onFinish={(values) => console.log('Clinical Step: ', values)}
      name={FORM_PARENT_KEY}
    >
      <Form.Item name="test" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </AnalysisForm>
  );
};

export default ClinicalSigns;
