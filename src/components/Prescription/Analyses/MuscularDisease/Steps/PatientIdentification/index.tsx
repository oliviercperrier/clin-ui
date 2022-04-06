import { Collapse, DatePicker, Form, Input, Radio, Typography } from 'antd';
import { FhirApi } from 'api/fhir';
import AnalysisForm from 'components/Prescription/Analyses/AnalysisForm';
import { formatRamq, isRamqValid } from 'components/Prescription/utils/ramq';
import SearchOrNoneFormItem from 'components/uiKit/form/SearchOrNoneFormItem';
import { useState } from 'react';
import MaskedDateInput from 'components/uiKit/input/MaskedDateInput';

import styles from './index.module.scss';

const FORM_PARENT_KEY = 'patient';

enum FORM_ITEMS_KEY {
  PRESCRIBING_INSTITUTION = 'prescribing_institution',
  FILE_NUMBER = 'file_number',
  NO_FILE = 'no_file',
  RAMQ_NUMBER = 'ramq_numnber',
  NO_RAMQ = 'no_ramq',
  LAST_NAME = 'last_name',
  FIRST_NAME = 'first_name',
  BIRTH_DATE = 'birth_date',
  SEX = 'sex',
}

const { Text } = Typography;
const getNamePath = (key: FORM_ITEMS_KEY) => [FORM_PARENT_KEY, key];

const PatientIdentification = () => {
  const [form] = Form.useForm();
  const [fileNumberNotFound, setFileNumberNotFound] = useState(false);
  const [ramqNumberNotFound, setRamqNumberNotFound] = useState(false);

  return (
    <AnalysisForm
      form={form}
      className={styles.patientIdentificationForm}
      onFinish={(values) => console.log('Patient Step: ', values)}
      labelWrap
      name="patient"
    >
      <Collapse bordered={false} defaultActiveKey={['patient']}>
        <Collapse.Panel key="patient" header="Patient">
          <Form.Item
            name={getNamePath(FORM_ITEMS_KEY.PRESCRIBING_INSTITUTION)}
            label="Établissement prescripteur"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value="CHUSJ">CHUSJ</Radio>
              <Radio value="CHUM">CHUM</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) =>
              getFieldValue(getNamePath(FORM_ITEMS_KEY.PRESCRIBING_INSTITUTION)) ? (
                <SearchOrNoneFormItem<any>
                  form={form}
                  inputFormItemProps={{
                    name: getNamePath(FORM_ITEMS_KEY.FILE_NUMBER),
                    rules: [{ required: true }],
                    required: true,
                    label: 'Dossier',
                  }}
                  inputProps={{
                    placeholder: '000000',
                  }}
                  checkboxFormItemProps={{
                    name: getNamePath(FORM_ITEMS_KEY.NO_FILE),
                    title: 'Aucun numéro de dossier',
                  }}
                  onReset={() => setFileNumberNotFound(false)}
                  onSearchDone={(value) => setFileNumberNotFound(!value)}
                  apiPromise={FhirApi.checkRamq}
                />
              ) : null
            }
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) =>
              getFieldValue(getNamePath(FORM_ITEMS_KEY.NO_FILE)) || fileNumberNotFound ? (
                <SearchOrNoneFormItem<any>
                  form={form}
                  inputFormItemProps={{
                    name: getNamePath(FORM_ITEMS_KEY.RAMQ_NUMBER),
                    required: true,
                    label: 'RAMQ',
                  }}
                  inputProps={{
                    placeholder: 'AAAA 0000 0000',
                    onPaste: (event) => {
                      event.preventDefault();
                    },
                    handleSearch: (value, search) =>
                      isRamqValid(value)
                        ? search(value)
                        : form.setFields([
                            {
                              name: getNamePath(FORM_ITEMS_KEY.RAMQ_NUMBER),
                              errors: ['Le numéro de RAMQ est invalide'],
                              value,
                            },
                          ]),
                    onChange: (event) =>
                      form.setFields([
                        {
                          name: getNamePath(FORM_ITEMS_KEY.RAMQ_NUMBER),
                          errors: [],
                          value: formatRamq(event.currentTarget.value),
                        },
                      ]),
                  }}
                  checkboxFormItemProps={{
                    name: getNamePath(FORM_ITEMS_KEY.NO_RAMQ),
                    title: 'Aucun numéro de RAMQ ou nouveau-né',
                  }}
                  onReset={() => setRamqNumberNotFound(false)}
                  onSearchDone={(value) => setRamqNumberNotFound(!value)}
                  apiPromise={FhirApi.checkRamq}
                />
              ) : null
            }
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) =>
              getFieldValue(getNamePath(FORM_ITEMS_KEY.NO_RAMQ)) || ramqNumberNotFound ? (
                <>
                  <Form.Item
                    wrapperCol={{ span: 12, xl: 8 }}
                    name={getNamePath(FORM_ITEMS_KEY.LAST_NAME)}
                    label="Nom de famille"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    wrapperCol={{ span: 12, xl: 8 }}
                    name={getNamePath(FORM_ITEMS_KEY.FIRST_NAME)}
                    label="Prénom"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    wrapperCol={{ span: 4 }}
                    name={getNamePath(FORM_ITEMS_KEY.BIRTH_DATE)}
                    label="Date de naissance"
                  >
                    <MaskedDateInput />
                  </Form.Item>
                  <Form.Item
                    name={getNamePath(FORM_ITEMS_KEY.SEX)}
                    label="Sexe"
                    rules={[{ required: true }]}
                  >
                    <Radio.Group>
                      <Radio value="female">Féminin</Radio>
                      <Radio value="male">Masculin</Radio>
                      <Radio value="unknown">Indéterminé</Radio>
                    </Radio.Group>
                  </Form.Item>
                </>
              ) : null
            }
          </Form.Item>
        </Collapse.Panel>
      </Collapse>
    </AnalysisForm>
  );
};

export default PatientIdentification;
