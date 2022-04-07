import { Form, FormInstance, Input, Radio } from 'antd';
import { FhirApi } from 'api/fhir';
import { Bundle, Patient } from 'api/fhir/models';
import { getRAMQValue } from 'api/fhir/patientHelper';
import { formatRamq, isRamqValid } from 'components/Prescription/utils/ramq';
import SearchOrNoneFormItem from 'components/uiKit/form/SearchOrNoneFormItem';
import MaskedDateInput from 'components/uiKit/input/MaskedDateInput';
import { useRpt } from 'hooks/rpt';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { FieldData } from 'rc-field-form/lib/interface';
import { IAnalysisFormPart } from 'components/Prescription/utils/type';
import { getNamePath } from 'components/Prescription/utils/form';
import RadioGroupSex from 'components/uiKit/form/RadioGroupSex';
import { SexValue } from 'utils/commonTypes';

type OwnProps = IAnalysisFormPart & {
  onRamqSearchStateChange?: (done: boolean) => void;
  onFileSearchStateChange?: (done: boolean) => void;
  onResetRamq?: () => void;
  initialFileSearchDone?: boolean;
  initialRamqSearchDone?: boolean;
};

export enum PATIENT_DATA_FI_KEY {
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

export enum InstitutionValue {
  CHUSJ = 'CHUSJ',
  CHUM = 'CHUM',
}

export interface IPatientDataType {
  [PATIENT_DATA_FI_KEY.BIRTH_DATE]: string;
  [PATIENT_DATA_FI_KEY.FILE_NUMBER]: string;
  [PATIENT_DATA_FI_KEY.NO_FILE]: boolean;
  [PATIENT_DATA_FI_KEY.RAMQ_NUMBER]: string;
  [PATIENT_DATA_FI_KEY.NO_RAMQ]: boolean;
  [PATIENT_DATA_FI_KEY.LAST_NAME]: string;
  [PATIENT_DATA_FI_KEY.FIRST_NAME]: string;
  [PATIENT_DATA_FI_KEY.SEX]: SexValue;
}

const PatientDataSearch = ({
  form,
  parentKey,
  onRamqSearchStateChange,
  onFileSearchStateChange,
  onResetRamq,
  initialFileSearchDone = false,
  initialRamqSearchDone = false,
}: OwnProps) => {
  const { rpt } = useRpt();
  const [fileSearchDone, setFileSearchDone] = useState(initialFileSearchDone);
  const [ramqSearchDone, setRamqSearchDone] = useState(initialRamqSearchDone);

  const getName = (key: PATIENT_DATA_FI_KEY) => getNamePath(parentKey, key);

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
          name: getName(PATIENT_DATA_FI_KEY.RAMQ_NUMBER),
          value: formatRamq(ramq),
        });
      }

      if (name) {
        fields.push(
          {
            name: getName(PATIENT_DATA_FI_KEY.FIRST_NAME),
            value: name.given.join(' '),
          },
          {
            name: getName(PATIENT_DATA_FI_KEY.LAST_NAME),
            value: name.family,
          },
        );
      }

      if (birthDate) {
        fields.push({
          name: getName(PATIENT_DATA_FI_KEY.BIRTH_DATE),
          value: birthDate,
        });
      }

      fields.push({
        name: getName(PATIENT_DATA_FI_KEY.SEX),
        value: patient?.gender,
      });

      form.setFields(fields);
    }
  };

  useEffect(() => setFileSearchDone(initialFileSearchDone), [initialFileSearchDone]);

  useEffect(() => setRamqSearchDone(initialRamqSearchDone), [initialRamqSearchDone]);

  useEffect(
    () => onRamqSearchStateChange && onRamqSearchStateChange(ramqSearchDone),
    [ramqSearchDone],
  );

  useEffect(
    () => onFileSearchStateChange && onFileSearchStateChange(fileSearchDone),
    [fileSearchDone],
  );

  return (
    <>
      <Form.Item
        name={getName(PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION)}
        label="Établissement prescripteur"
        rules={[{ required: true }]}
      >
        <Radio.Group disabled={ramqSearchDone}>
          <Radio value={InstitutionValue.CHUSJ}>CHUSJ</Radio>
          <Radio value={InstitutionValue.CHUM}>CHUM</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue(getName(PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION)) ? (
            <SearchOrNoneFormItem<Bundle<Patient>>
              form={form}
              inputFormItemProps={{
                name: getName(PATIENT_DATA_FI_KEY.FILE_NUMBER),
                rules: [{ required: true }],
                required: true,
                label: 'Dossier',
              }}
              inputProps={{
                placeholder: '000000',
              }}
              checkboxFormItemProps={{
                name: getName(PATIENT_DATA_FI_KEY.NO_FILE),
                title: 'Aucun numéro de dossier',
              }}
              onReset={() => {
                setFileSearchDone(false);
                setRamqSearchDone(false);
                form.resetFields([
                  getName(PATIENT_DATA_FI_KEY.FIRST_NAME),
                  getName(PATIENT_DATA_FI_KEY.LAST_NAME),
                  getName(PATIENT_DATA_FI_KEY.SEX),
                  getName(PATIENT_DATA_FI_KEY.RAMQ_NUMBER),
                  getName(PATIENT_DATA_FI_KEY.NO_RAMQ),
                  getName(PATIENT_DATA_FI_KEY.NO_FILE),
                  getName(PATIENT_DATA_FI_KEY.BIRTH_DATE),
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
                (ramqSearchDone && form.getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_FILE))) ||
                getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_RAMQ))
              }
            />
          ) : null
        }
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_FILE)) || fileSearchDone ? (
            <SearchOrNoneFormItem<Bundle<Patient>>
              form={form}
              inputFormItemProps={{
                name: getName(PATIENT_DATA_FI_KEY.RAMQ_NUMBER),
                required: true,
                label: 'RAMQ',
              }}
              checkboxProps={{
                onChange: (e) => {
                  const checked = e.target.checked;
                  if (!checked) {
                    onResetRamq && onResetRamq();
                  }
                },
              }}
              inputProps={{
                placeholder: 'AAAA 0000 0000',
                onSearch: (value, search) =>
                  isRamqValid(value)
                    ? (search as Function)(value.replace(/\s/g, ''))
                    : form.setFields([
                        {
                          name: getName(PATIENT_DATA_FI_KEY.RAMQ_NUMBER),
                          errors: ['Le numéro de RAMQ est invalide'],
                          value,
                        },
                      ]),
                onChange: (event) =>
                  form.setFields([
                    {
                      name: getName(PATIENT_DATA_FI_KEY.RAMQ_NUMBER),
                      errors: [],
                      value: formatRamq(event.currentTarget.value),
                    },
                  ]),
              }}
              checkboxFormItemProps={{
                name: getName(PATIENT_DATA_FI_KEY.NO_RAMQ),
                title: 'Aucun numéro de RAMQ ou nouveau-né',
              }}
              onReset={() => {
                onResetRamq && onResetRamq();
                setRamqSearchDone(false);
                form.resetFields([
                  getName(PATIENT_DATA_FI_KEY.FIRST_NAME),
                  getName(PATIENT_DATA_FI_KEY.LAST_NAME),
                  getName(PATIENT_DATA_FI_KEY.SEX),
                  getName(PATIENT_DATA_FI_KEY.NO_RAMQ),
                  getName(PATIENT_DATA_FI_KEY.BIRTH_DATE),
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
          getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_RAMQ)) || ramqSearchDone ? (
            <>
              <Form.Item
                name={getName(PATIENT_DATA_FI_KEY.LAST_NAME)}
                label="Nom de famille"
                rules={[{ required: true }]}
                wrapperCol={{ span: 10, sm: 12, xxl: 6 }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={getName(PATIENT_DATA_FI_KEY.FIRST_NAME)}
                label="Prénom"
                rules={[{ required: true }]}
                wrapperCol={{ span: 10, sm: 12, xxl: 6 }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={getName(PATIENT_DATA_FI_KEY.BIRTH_DATE)}
                label="Date de naissance"
                rules={[{ required: true }]}
              >
                <MaskedDateInput />
              </Form.Item>
              <Form.Item
                name={getName(PATIENT_DATA_FI_KEY.SEX)}
                label="Sexe"
                rules={[{ required: true }]}
              >
                <RadioGroupSex />
              </Form.Item>
            </>
          ) : null
        }
      </Form.Item>
    </>
  );
};

export default PatientDataSearch;
