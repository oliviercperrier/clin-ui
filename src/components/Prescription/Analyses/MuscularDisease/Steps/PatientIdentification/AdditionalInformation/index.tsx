import { Checkbox, Form, Input, Radio, Space, Typography } from 'antd';
import { getNamePath } from 'components/Prescription/utils/form';
import { formatRamq, RAMQ_PATTERN } from 'components/Prescription/utils/ramq';
import { IAnalysisFormPart } from 'components/Prescription/utils/type';
import RadioDateFormItem from 'components/uiKit/form/RadioDateFormItem';
import RadioGroupSex from 'components/uiKit/form/RadioGroupSex';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { calculateGestationalAgeFromDDM, calculateGestationalAgeFromDPA } from 'utils/age';
import { SexValue } from 'utils/commonTypes';

import styles from './index.module.scss';

const { Text } = Typography;

type OwnProps = IAnalysisFormPart & {
  showNewBornSection?: boolean;
  initialData?: IAddInfoDataType;
};

enum GestationalAgeValues {
  DDM = 'ddm',
  DPA = 'dpa',
}

export enum ADD_INFO_FI_KEY {
  GESTATIONAL_AGE = 'additional_info_gestational_age',
  GESTATIONAL_AGE_DDM = 'additional_info_gestational_age_ddm',
  GESTATIONAL_AGE_DPA = 'additional_info_gestational_age_dpa',
  PRENATAL_DIAGNOSIS = 'additional_info_prenatal_diagnosis',
  FOETUS_SEX = 'additional_info_foetus_sex',
  NEW_BORN = 'additional_info_new_born',
  MOTHER_RAMQ_NUMBER = 'additional_info_mother_ramq_number',
}

export interface IAddInfoDataType {
  [ADD_INFO_FI_KEY.GESTATIONAL_AGE]: string;
  [ADD_INFO_FI_KEY.GESTATIONAL_AGE_DDM]: string;
  [ADD_INFO_FI_KEY.GESTATIONAL_AGE_DPA]: string;
  [ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS]: boolean;
  [ADD_INFO_FI_KEY.FOETUS_SEX]: SexValue;
  [ADD_INFO_FI_KEY.NEW_BORN]: boolean;
  [ADD_INFO_FI_KEY.MOTHER_RAMQ_NUMBER]: string;
}

const AdditionalInformation = ({
  form,
  parentKey,
  showNewBornSection = false,
  initialData,
}: OwnProps) => {
  const [localShowNewBorn, setLocalShowNewBorn] = useState(showNewBornSection);
  const [gestationalAgeDPA, setGestationalAgeDPA] = useState<number | undefined>(undefined);
  const [gestationalAgeDDM, setGestationalAgeDDM] = useState<number | undefined>(undefined);

  const getName = (key: ADD_INFO_FI_KEY) => getNamePath(parentKey, key);

  useEffect(() => {
    if (localShowNewBorn !== showNewBornSection) {
      setLocalShowNewBorn(showNewBornSection);
    }
  }, [showNewBornSection]);

  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      form.setFields([
        {
          name: getName(ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS),
          value: initialData.additional_info_prenatal_diagnosis,
        },
        {
          name: getName(ADD_INFO_FI_KEY.NEW_BORN),
          value: initialData.additional_info_new_born,
        },
        {
          name: getName(ADD_INFO_FI_KEY.FOETUS_SEX),
          value: initialData.additional_info_foetus_sex,
        },
        {
          name: getName(ADD_INFO_FI_KEY.GESTATIONAL_AGE),
          value: initialData.additional_info_gestational_age,
        },
        {
          name: getName(ADD_INFO_FI_KEY.GESTATIONAL_AGE_DDM),
          value: initialData.additional_info_gestational_age_ddm,
        },
        {
          name: getName(ADD_INFO_FI_KEY.GESTATIONAL_AGE_DPA),
          value: initialData.additional_info_gestational_age_dpa,
        },
        {
          name: getName(ADD_INFO_FI_KEY.MOTHER_RAMQ_NUMBER),
          value: initialData.additional_info_mother_ramq_number,
        },
      ]);
    }
  }, []);

  return (
    <Form.Item noStyle shouldUpdate>
      {({ getFieldValue }) => (
        <>
          <Form.Item
            label="Diagnostic prénatal"
            name={getName(ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS)}
            valuePropName="checked"
          >
            <Checkbox disabled={getFieldValue(getName(ADD_INFO_FI_KEY.NEW_BORN))}>Oui</Checkbox>
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) =>
              getFieldValue(getName(ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS)) ? (
                <>
                  <Form.Item
                    name={getName(ADD_INFO_FI_KEY.FOETUS_SEX)}
                    label="Sexe (foetus)"
                    rules={[{ required: true }]}
                  >
                    <RadioGroupSex />
                  </Form.Item>
                  <Form.Item
                    label="Âge gestationnel"
                    name={getName(ADD_INFO_FI_KEY.GESTATIONAL_AGE)}
                    rules={[{ required: true }]}
                  >
                    <Radio.Group>
                      <Space direction="vertical" className={styles.verticalRadioWrapper}>
                        <RadioDateFormItem
                          title="Date des dernières menstruation (DDM)"
                          radioProps={{
                            value: GestationalAgeValues.DDM,
                            name: GestationalAgeValues.DDM,
                          }}
                          dateInputProps={{
                            formItemProps: {
                              name: getName(ADD_INFO_FI_KEY.GESTATIONAL_AGE_DDM),
                            },
                            extra: gestationalAgeDDM ? <Text>{gestationalAgeDDM}</Text> : <></>,
                            onValidate: (valid, value) => {
                              if (!valid && gestationalAgeDDM) {
                                setGestationalAgeDDM(undefined);
                              } else {
                                setGestationalAgeDDM(calculateGestationalAgeFromDDM(value));
                              }
                            },
                          }}
                          parentFormItemName={getName(ADD_INFO_FI_KEY.GESTATIONAL_AGE)}
                        />
                        <RadioDateFormItem
                          title="Date prévue d'accouchement (DPA)"
                          radioProps={{
                            value: GestationalAgeValues.DPA,
                            name: GestationalAgeValues.DPA,
                          }}
                          dateInputProps={{
                            formItemProps: {
                              name: getName(ADD_INFO_FI_KEY.GESTATIONAL_AGE_DPA),
                            },
                            extra: gestationalAgeDPA && <>{gestationalAgeDPA}</>,
                            onValidate: (valid, value) => {
                              if (!valid && gestationalAgeDPA) {
                                setGestationalAgeDPA(undefined);
                              } else {
                                setGestationalAgeDPA(calculateGestationalAgeFromDPA(value));
                              }
                            },
                          }}
                          parentFormItemName={getName(ADD_INFO_FI_KEY.GESTATIONAL_AGE)}
                        />
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </>
              ) : null
            }
          </Form.Item>
          {localShowNewBorn && (
            <>
              <Form.Item
                label="Nouveau-né"
                name={getName(ADD_INFO_FI_KEY.NEW_BORN)}
                valuePropName="checked"
              >
                <Checkbox disabled={getFieldValue(getName(ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS))}>
                  Oui
                </Checkbox>
              </Form.Item>
              {getFieldValue(getName(ADD_INFO_FI_KEY.NEW_BORN)) && (
                <Form.Item
                  label="RAMQ de la mère"
                  name={getName(ADD_INFO_FI_KEY.MOTHER_RAMQ_NUMBER)}
                  rules={[{ type: 'regexp', pattern: RAMQ_PATTERN }]}
                  wrapperCol={{ span: 10, sm: 12, xxl: 6 }}
                >
                  <Input
                    placeholder="AAAA 0000 0000"
                    onChange={(e) =>
                      form.setFields([
                        {
                          name: getName(ADD_INFO_FI_KEY.MOTHER_RAMQ_NUMBER),
                          errors: [],
                          value: formatRamq(e.currentTarget.value),
                        },
                      ])
                    }
                  />
                </Form.Item>
              )}
            </>
          )}
        </>
      )}
    </Form.Item>
  );
};

export default AdditionalInformation;
