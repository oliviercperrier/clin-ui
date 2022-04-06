import { Form, FormInstance, Input, Radio } from 'antd';
import { FhirApi } from 'api/fhir';
import { Bundle, Patient } from 'api/fhir/models';
import { getRAMQValue } from 'api/fhir/patientHelper';
import { formatRamq, isRamqValid } from 'components/Prescription/utils/ramq';
import SearchOrNoneFormItem from 'components/uiKit/form/SearchOrNoneFormItem';
import MaskedDateInput from 'components/uiKit/input/MaskedDateInput';
import { useRpt } from 'hooks/rpt';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { FieldData } from 'rc-field-form/lib/interface';

interface OwnProps {
  form: FormInstance;
  parentKey?: string;
}

export enum FORM_ITEMS_KEY {
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

const PatientDataSearch = ({ form, parentKey }: OwnProps) => {
  const { rpt } = useRpt();
  const [fileSearchDone, setFileSearchDone] = useState(false);
  const [ramqSearchDone, setRamqSearchDone] = useState(false);
  const [noRamq, setNoRamq] = useState(false);

  const getNamePath = (key: FORM_ITEMS_KEY) => (parentKey ? [parentKey, key] : key);

  const updateFormFromPatient = (form: FormInstance, bundle?: Bundle<Patient>) => {
    const entry = bundle?.entry;

    if (entry && !isEmpty(entry)) {
      const fields: FieldData[] = [];
      const patient = entry[0].resource;
      const name = patient?.name ? patient.name[0] : undefined;
      const birthDate = patient?.birthDate;
      const ramq = getRAMQValue(patient);

      if (ramq) {
        fields.push({
          name: getNamePath(FORM_ITEMS_KEY.RAMQ_NUMBER),
          value: formatRamq(ramq),
        });
      }

      if (name) {
        fields.push(
          {
            name: getNamePath(FORM_ITEMS_KEY.FIRST_NAME),
            value: name.given.join(' '),
          },
          {
            name: getNamePath(FORM_ITEMS_KEY.LAST_NAME),
            value: name.family,
          },
        );
      }

      if (birthDate) {
        fields.push({
          name: getNamePath(FORM_ITEMS_KEY.BIRTH_DATE),
          value: birthDate,
        });
      }

      fields.push({
        name: getNamePath(FORM_ITEMS_KEY.SEX),
        value: patient?.gender,
      });

      console.log(fields);

      form.setFields(fields);
    }
  };

  return (
    <>
      <Form.Item
        name={getNamePath(FORM_ITEMS_KEY.PRESCRIBING_INSTITUTION)}
        label="Établissement prescripteur"
        rules={[{ required: true }]}
      >
        <Radio.Group disabled={ramqSearchDone}>
          <Radio value="CHUSJ">CHUSJ</Radio>
          <Radio value="CHUM">CHUM</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue(getNamePath(FORM_ITEMS_KEY.PRESCRIBING_INSTITUTION)) ? (
            <SearchOrNoneFormItem<Bundle<Patient>>
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
              onReset={() => {
                setFileSearchDone(false);
                setRamqSearchDone(false);
                form.resetFields([
                  getNamePath(FORM_ITEMS_KEY.FIRST_NAME),
                  getNamePath(FORM_ITEMS_KEY.LAST_NAME),
                  getNamePath(FORM_ITEMS_KEY.SEX),
                  getNamePath(FORM_ITEMS_KEY.RAMQ_NUMBER),
                  getNamePath(FORM_ITEMS_KEY.NO_RAMQ),
                  getNamePath(FORM_ITEMS_KEY.NO_FILE),
                  getNamePath(FORM_ITEMS_KEY.BIRTH_DATE),
                ]);
              }}
              onSearchDone={(value) => {
                updateFormFromPatient(form, value);
                setFileSearchDone(true);
                if (value?.entry && getRAMQValue(value.entry[0].resource)) {
                  setRamqSearchDone(true);
                }
              }}
              apiPromise={(value) => FhirApi.checkRamq(rpt, value)}
              disabled={
                (ramqSearchDone && form.getFieldValue(getNamePath(FORM_ITEMS_KEY.NO_FILE))) ||
                noRamq
              }
            />
          ) : null
        }
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue(getNamePath(FORM_ITEMS_KEY.NO_FILE)) || fileSearchDone ? (
            <SearchOrNoneFormItem<Bundle<Patient>>
              form={form}
              inputFormItemProps={{
                name: getNamePath(FORM_ITEMS_KEY.RAMQ_NUMBER),
                required: true,
                label: 'RAMQ',
              }}
              checkboxProps={{
                onChange: (e) => {
                  setNoRamq(e.target.checked);
                },
              }}
              inputProps={{
                placeholder: 'AAAA 0000 0000',
                handlesearch: (value, search) =>
                  isRamqValid(value)
                    ? search(value.replace(/\s/g, ''))
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
              onReset={() => {
                setRamqSearchDone(false);
                form.resetFields([
                  getNamePath(FORM_ITEMS_KEY.FIRST_NAME),
                  getNamePath(FORM_ITEMS_KEY.LAST_NAME),
                  getNamePath(FORM_ITEMS_KEY.SEX),
                  getNamePath(FORM_ITEMS_KEY.NO_RAMQ),
                  getNamePath(FORM_ITEMS_KEY.BIRTH_DATE),
                ]);
              }}
              onSearchDone={(value) => {
                updateFormFromPatient(form, value);
                setRamqSearchDone(true);
              }}
              apiPromise={(value) => FhirApi.checkRamq(rpt, value)}
              disabled={ramqSearchDone}
            />
          ) : null
        }
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue(getNamePath(FORM_ITEMS_KEY.NO_RAMQ)) || ramqSearchDone ? (
            <>
              <Form.Item
                name={getNamePath(FORM_ITEMS_KEY.LAST_NAME)}
                label="Nom de famille"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={getNamePath(FORM_ITEMS_KEY.FIRST_NAME)}
                label="Prénom"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={getNamePath(FORM_ITEMS_KEY.BIRTH_DATE)}
                label="Date de naissance"
                rules={[{ required: true }]}
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
    </>
  );
};

export default PatientDataSearch;
