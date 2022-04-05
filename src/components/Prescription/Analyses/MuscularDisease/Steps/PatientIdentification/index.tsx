import { Form, Input } from 'antd';
import AnalysisForm from 'components/Prescription/Analyses/AnalysisForm';

const PatientIdentification = () => {
  return (
    <AnalysisForm onFinish={(values) => console.log('Patient Step: ', values)}>
      <Form.Item name="lol" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </AnalysisForm>
  );
};

export default PatientIdentification;
