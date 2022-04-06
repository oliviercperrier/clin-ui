import { Checkbox, Collapse, Form, Input, Radio, Space } from 'antd';
import AnalysisForm from 'components/Prescription/Analyses/AnalysisForm';
import PatientDataSearch from 'components/Prescription/components/PatientDataSearch';
import RadioDateFormItem from 'components/uiKit/form/RadioDateFormItem';

import styles from './index.module.scss';

const FORM_KEY = 'patient';

enum FORM_ITEM_KEY {
  GESTATIONAL_AGE = 'gestational_age',
  GESTATIONAL_AGE_DDM = 'gestational_age_ddm',
  GESTATIONAL_AGE_DPA = 'gestational_age_dpa',
  PRENATAL_DIAGNOSIS = 'prenatal_diagnosis',
  FOETUS_SEX = 'foetus_sex',
  NEW_BORN = 'new_born',
  MOTHER_RAMQ_NUMBER = 'mother_ramq_number',
}

const PatientIdentification = () => {
  const [form] = Form.useForm();

  return (
    <AnalysisForm
      form={form}
      className={styles.patientIdentificationForm}
      onFinish={(values) => console.log('Patient Step: ', values)}
      name={FORM_KEY}
    >
      <Space direction="vertical" className={styles.formContentWrapper}>
        <Collapse bordered={false} defaultActiveKey={['patient']}>
          <Collapse.Panel key="patient" header="Patient">
            <PatientDataSearch form={form} parentKey={FORM_KEY} />
          </Collapse.Panel>
        </Collapse>
        <Collapse bordered={false} defaultActiveKey={['additional_information']}>
          <Collapse.Panel key="additional_information" header="Information supplémentaires">
            <Form.Item
              label="Diagnostic prénatal"
              name={[FORM_KEY, FORM_ITEM_KEY.PRENATAL_DIAGNOSIS]}
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
            <Form.Item
              name={[FORM_KEY, FORM_ITEM_KEY.FOETUS_SEX]}
              label="Sexe (foetus)"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value="female">Féminin</Radio>
                <Radio value="male">Masculin</Radio>
                <Radio value="unknown">Indéterminé</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Âge gestationnel"
              name={[FORM_KEY, FORM_ITEM_KEY.GESTATIONAL_AGE]}
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Space direction="vertical" className={styles.verticalRadioWrapper}>
                  <RadioDateFormItem
                    title="Date des dernières menstruation (DDM)"
                    radioProps={{ value: 'ddm', name: 'ddm' }}
                    dateFormItemProps={{
                      name: [FORM_KEY, FORM_ITEM_KEY.GESTATIONAL_AGE_DDM],
                    }}
                    parentFormItemName={[FORM_KEY, FORM_ITEM_KEY.GESTATIONAL_AGE]}
                  />
                  <RadioDateFormItem
                    title="Date prévue d'accouchement (DPA)"
                    radioProps={{ value: 'dpa', name: 'dpa' }}
                    dateFormItemProps={{
                      name: [FORM_KEY, FORM_ITEM_KEY.GESTATIONAL_AGE_DPA],
                    }}
                    parentFormItemName={[FORM_KEY, FORM_ITEM_KEY.GESTATIONAL_AGE]}
                  />
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Nouveau-né"
              name={[FORM_KEY, FORM_ITEM_KEY.NEW_BORN]}
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
            <Form.Item label="RAMQ de la mère" name={[FORM_KEY, FORM_ITEM_KEY.MOTHER_RAMQ_NUMBER]}>
              <Input />
            </Form.Item>
          </Collapse.Panel>
        </Collapse>
      </Space>
    </AnalysisForm>
  );
};

export default PatientIdentification;
