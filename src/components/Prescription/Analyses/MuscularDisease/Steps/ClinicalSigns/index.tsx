import { Form, Input } from "antd";
import AnalysisForm from "components/Prescription/Analyses/AnalysisForm";

const ClinicalSigns = () => (
  <AnalysisForm onFinish={(values) => console.log("Clinical Step: ", values)}>
    <Form.Item name="test" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
  </AnalysisForm>
);

export default ClinicalSigns;
