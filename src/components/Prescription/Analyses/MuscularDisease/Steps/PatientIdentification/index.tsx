import { Collapse, Form, Radio } from 'antd';
import AnalysisForm from 'components/Prescription/Analyses/AnalysisForm';
import SearchNoneFormItem from 'components/uiKit/Form/SearchNoneFormItem';

import styles from './index.module.scss';

const PatientIdentification = () => {
  const [form] = Form.useForm();

  return (
    <AnalysisForm
      form={form}
      className={styles.patientIdentificationForm}
      onFinish={(values) => console.log('Patient Step: ', values)}
    >
      <Collapse bordered={false} defaultActiveKey={['patient']}>
        <Collapse.Panel key="patient" header="Patient">
          <Form.Item
            name="radio-group"
            label="Établissement prescripteur"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value="CHUSJ">CHUSJ</Radio>
              <Radio value="CHUM">CHUM</Radio>
            </Radio.Group>
          </Form.Item>
          <SearchNoneFormItem
            form={form}
            inputFormItemProps={{
              label: 'Dossier',
              name: 'file-number',
              rules: [{ required: true }],
              required: true,
            }}
            inputProps={{
              placeholder: '000000',
              onSearch: (value) => {
                console.log(value);
              },
            }}
            checkboxFormItemProps={{ name: 'no-file', title: 'Aucun numéro de dossier' }}
          />
          <SearchNoneFormItem
            form={form}
            inputFormItemProps={{
              label: 'RAMQ',
              name: 'ramq-number',
              rules: [{ required: true }],
              required: true,
            }}
            inputProps={{ placeholder: 'AAAA 0000 0000' }}
            checkboxFormItemProps={{
              name: 'no-ramq',
              title: 'Aucun numéro de RAMQ ou nouveau-né',
            }}
          />
        </Collapse.Panel>
      </Collapse>
    </AnalysisForm>
  );
};

export default PatientIdentification;
