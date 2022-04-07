import { Checkbox, Collapse, Form, Input, Radio, Space } from 'antd';
import AnalysisForm from 'components/Prescription/Analyses/AnalysisForm';
import PatientDataSearch, {
  FORM_ITEMS_KEY as PATIENT_DATA_FORM_ITEMS_KEY,
} from 'components/Prescription/components/PatientDataSearch';
import { formatRamq, RAMQ_PATTERN } from 'components/Prescription/utils/ramq';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import RadioDateFormItem from 'components/uiKit/form/RadioDateFormItem';
import { useState } from 'react';

import styles from './index.module.scss';

enum FORM_ITEM_KEY {
  GESTATIONAL_AGE = 'gestational_age',
  GESTATIONAL_AGE_DDM = 'gestational_age_ddm',
  GESTATIONAL_AGE_DPA = 'gestational_age_dpa',
  PRENATAL_DIAGNOSIS = 'prenatal_diagnosis',
  FOETUS_SEX = 'foetus_sex',
  NEW_BORN = 'new_born',
  MOTHER_RAMQ_NUMBER = 'mother_ramq_number',
}

const PatientIdentification = (props: IAnalysisStepForm) => {
  const FORM_KEY = props.formName;
  const [form] = Form.useForm();
  const [ramqSearchDone, setRamqSearchDone] = useState(false);

  return (
    <AnalysisForm form={form} className={styles.patientIdentificationForm} name={FORM_KEY}>
      <Space direction="vertical" className={styles.formContentWrapper}>
        <Collapse bordered={false} defaultActiveKey={['patient']}>
          <Collapse.Panel key="patient" header="Patient">
            <PatientDataSearch
              form={form}
              parentKey={FORM_KEY}
              onRamqSearchStateChange={setRamqSearchDone}
              onResetRamq={() => {
                form.resetFields([
                  [FORM_KEY, FORM_ITEM_KEY.PRENATAL_DIAGNOSIS],
                  [FORM_KEY, FORM_ITEM_KEY.FOETUS_SEX],
                  [FORM_KEY, FORM_ITEM_KEY.GESTATIONAL_AGE],
                  [FORM_KEY, FORM_ITEM_KEY.NEW_BORN],
                ]);
              }}
            />
          </Collapse.Panel>
        </Collapse>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) =>
            getFieldValue([FORM_KEY, PATIENT_DATA_FORM_ITEMS_KEY.NO_RAMQ]) || ramqSearchDone ? (
              <Collapse bordered={false} defaultActiveKey={['additional_information']}>
                <Collapse.Panel key="additional_information" header="Information supplémentaires">
                  <Form.Item
                    label="Diagnostic prénatal"
                    name={[FORM_KEY, FORM_ITEM_KEY.PRENATAL_DIAGNOSIS]}
                    valuePropName="checked"
                  >
                    <Checkbox disabled={getFieldValue([FORM_KEY, FORM_ITEM_KEY.NEW_BORN])}>
                      Oui
                    </Checkbox>
                  </Form.Item>
                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) =>
                      getFieldValue([FORM_KEY, FORM_ITEM_KEY.PRENATAL_DIAGNOSIS]) ? (
                        <>
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
                        </>
                      ) : null
                    }
                  </Form.Item>
                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) =>
                      getFieldValue([FORM_KEY, PATIENT_DATA_FORM_ITEMS_KEY.NO_RAMQ]) ? (
                        <>
                          <Form.Item
                            label="Nouveau-né"
                            name={[FORM_KEY, FORM_ITEM_KEY.NEW_BORN]}
                            valuePropName="checked"
                          >
                            <Checkbox
                              disabled={getFieldValue([FORM_KEY, FORM_ITEM_KEY.PRENATAL_DIAGNOSIS])}
                            >
                              Oui
                            </Checkbox>
                          </Form.Item>
                          {getFieldValue([FORM_KEY, FORM_ITEM_KEY.NEW_BORN]) && (
                            <Form.Item
                              label="RAMQ de la mère"
                              name={[FORM_KEY, FORM_ITEM_KEY.MOTHER_RAMQ_NUMBER]}
                              rules={[{ type: 'regexp', pattern: RAMQ_PATTERN }]}
                            >
                              <Input
                                placeholder="AAAA 0000 0000"
                                onChange={(e) =>
                                  form.setFields([
                                    {
                                      name: [FORM_KEY, FORM_ITEM_KEY.MOTHER_RAMQ_NUMBER],
                                      errors: [],
                                      value: formatRamq(e.currentTarget.value),
                                    },
                                  ])
                                }
                              />
                            </Form.Item>
                          )}
                        </>
                      ) : null
                    }
                  </Form.Item>
                </Collapse.Panel>
              </Collapse>
            ) : null
          }
        </Form.Item>
      </Space>
    </AnalysisForm>
  );
};

export default PatientIdentification;
