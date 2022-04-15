import { Form, FormInstance, Input, Radio } from 'antd';
import { FhirApi } from 'api/fhir';
import { Bundle, Patient } from 'api/fhir/models';
import { getRAMQValue } from 'api/fhir/patientHelper';
import { formatRamq, isRamqValid } from 'components/Prescription/utils/ramq';
import SearchOrNoneFormItem from 'components/uiKit/form/SearchOrNoneFormItem';
import { useRpt } from 'hooks/rpt';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { FieldData } from 'rc-field-form/lib/interface';
import { IAnalysisFormPart, IGetNamePathParams } from 'components/Prescription/utils/type';
import {
  getNamePath,
  isEnumHasField,
  resetFieldError,
  setFieldError,
  setFieldValue,
  setInitialValues,
} from 'components/Prescription/utils/form';
import RadioGroupSex from 'components/uiKit/form/RadioGroupSex';
import { SexValue } from 'utils/commonTypes';
import InputDateFormItem from 'components/uiKit/form/InputDateFormItem';
import { defaultFormItemsRules } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';

import styles from './index.module.scss';

type OwnProps = IAnalysisFormPart & {
  onRamqSearchStateChange?: (done: boolean) => void;
  onFileSearchStateChange?: (done: boolean) => void;
  onResetRamq?: () => void;
  initialFileSearchDone?: boolean;
  initialRamqSearchDone?: boolean;
  initialData?: IPatientDataType;
};

export enum PATIENT_DATA_FI_KEY {
  PRESCRIBING_INSTITUTION = 'patient_prescribing_institution',
  FILE_NUMBER = 'patient_file_number',
  NO_FILE = 'patient_no_file',
  RAMQ_NUMBER = 'patient_ramq_number',
  NO_RAMQ = 'patient_no_ramq',
  LAST_NAME = 'patient_last_name',
  FIRST_NAME = 'patient_first_name',
  BIRTH_DATE = 'patient_birth_date',
  SEX = 'patient_sex',
}

export enum InstitutionValue {
  CHUSJ = 'CHUSJ',
  CHUM = 'CHUM',
}

export interface IPatientDataType {
  [PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION]: InstitutionValue;
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
  initialData,
}: OwnProps) => {
  const { rpt } = useRpt();
  const [fileSearchDone, setFileSearchDone] = useState(initialFileSearchDone);
  const [ramqSearchDone, setRamqSearchDone] = useState(initialRamqSearchDone);

  const getName = (...key: IGetNamePathParams) => getNamePath(parentKey, key);

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

      fields.push(
        {
          name: getName(PATIENT_DATA_FI_KEY.BIRTH_DATE),
          value: birthDate,
        },
        {
          name: getName(PATIENT_DATA_FI_KEY.SEX),
          value: patient?.gender,
        },
      );

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

  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      setFileSearchDone(!!(initialData.patient_no_file || initialData.patient_file_number));
      setRamqSearchDone(!!(initialData.patient_no_ramq || initialData.patient_ramq_number));
      setInitialValues(form, getName, initialData, PATIENT_DATA_FI_KEY);
    }
  }, []);

  return (
    <div className={styles.patientDataSearchWrapper}>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => (
          <Form.Item
            name={getName(PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION)}
            label="Établissement prescripteur"
            rules={defaultFormItemsRules}
          >
            <Radio.Group
              disabled={
                getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_FILE)) ||
                getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_RAMQ)) ||
                fileSearchDone ||
                ramqSearchDone
              }
            >
              <Radio value={InstitutionValue.CHUSJ}>CHUSJ</Radio>
              <Radio value={InstitutionValue.CHUM}>CHUM</Radio>
            </Radio.Group>
          </Form.Item>
        )}
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue(getName(PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION)) ? (
            <SearchOrNoneFormItem<Bundle<Patient>>
              form={form}
              inputFormItemProps={{
                name: getName(PATIENT_DATA_FI_KEY.FILE_NUMBER),
                rules: [
                  {
                    required: true,
                    validateTrigger: 'onSubmit',
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(new Error('Ce champs est obligatoire'));
                      }

                      if (!fileSearchDone) {
                        return Promise.reject(new Error('Cliquer sur rechercher'));
                      }

                      return Promise.resolve();
                    },
                  },
                ],
                required: true,
                label: 'Dossier',
              }}
              inputProps={{
                placeholder: '000000',
                onSearch: (value, search) => (search as Function)(value.replace(/\s/g, '')),
              }}
              checkboxFormItemProps={{
                name: getName(PATIENT_DATA_FI_KEY.NO_FILE),
                title: 'Aucun numéro de dossier',
              }}
              checkboxProps={{
                onChange: (e) => setFileSearchDone(e.target.checked),
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
              apiPromise={(value) => FhirApi.searchPatient(rpt, value)}
              disabled={
                ramqSearchDone ||
                getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_RAMQ)) ||
                (fileSearchDone && !getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_FILE)))
              }
            />
          ) : null
        }
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_FILE)) || fileSearchDone ? (
            <>
              <SearchOrNoneFormItem<Bundle<Patient>>
                form={form}
                inputFormItemProps={{
                  name: getName(PATIENT_DATA_FI_KEY.RAMQ_NUMBER),
                  rules: [
                    {
                      required: true,
                      validateTrigger: 'onSubmit',
                      validator: (_, value) => {
                        if (!value) {
                          return Promise.reject(new Error('Ce champs est obligatoire'));
                        } else if (!isRamqValid(value)) {
                          return Promise.reject(new Error('Le numéro de RAMQ est invalide'));
                        } else if (!ramqSearchDone) {
                          return Promise.reject(new Error('Cliquer sur rechercher'));
                        }

                        return Promise.resolve();
                      },
                    },
                  ],
                  label: 'RAMQ',
                  required: true,
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
                  onSearch: (value, search) => {
                    resetFieldError(form, getName(PATIENT_DATA_FI_KEY.RAMQ_NUMBER));

                    if (isRamqValid(value)) {
                      (search as Function)(value.replace(/\s/g, ''));
                    } else {
                      setFieldError(
                        form,
                        getName(PATIENT_DATA_FI_KEY.RAMQ_NUMBER),
                        'Le numéro de RAMQ est invalide',
                      );
                    }
                  },
                  onChange: (event) =>
                    setFieldValue(
                      form,
                      getName(PATIENT_DATA_FI_KEY.RAMQ_NUMBER),
                      formatRamq(event.currentTarget.value),
                    ),
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
                apiPromise={(value) => FhirApi.searchPatient(rpt, value)}
                disabled={ramqSearchDone && !getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_RAMQ))}
              />
            </>
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
                rules={defaultFormItemsRules}
                wrapperCol={{ span: 10, sm: 12, xxl: 6 }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={getName(PATIENT_DATA_FI_KEY.FIRST_NAME)}
                label="Prénom"
                rules={defaultFormItemsRules}
                wrapperCol={{ span: 10, sm: 12, xxl: 6 }}
              >
                <Input />
              </Form.Item>
              <InputDateFormItem
                formItemProps={{
                  label: 'Date de naissance',
                  name: getName(PATIENT_DATA_FI_KEY.BIRTH_DATE),
                  required: true,
                }}
              />
              <Form.Item
                name={getName(PATIENT_DATA_FI_KEY.SEX)}
                label="Sexe"
                rules={defaultFormItemsRules}
                className="noMarginBtm"
              >
                <RadioGroupSex />
              </Form.Item>
            </>
          ) : null
        }
      </Form.Item>
    </div>
  );
};

export default PatientDataSearch;
