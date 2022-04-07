import { Checkbox, Form, Input, Radio, Space } from 'antd';
import { getNamePath } from 'components/Prescription/utils/form';
import { formatRamq, RAMQ_PATTERN } from 'components/Prescription/utils/ramq';
import { IAnalysisFormPart } from 'components/Prescription/utils/type';
import RadioDateFormItem from 'components/uiKit/form/RadioDateFormItem';
import RadioGroupSex from 'components/uiKit/form/RadioGroupSex';
import { useEffect, useState } from 'react';
import { SexValue } from 'utils/commonTypes';

import styles from './index.module.scss';

type OwnProps = IAnalysisFormPart & {
  showNewBornSection?: boolean;
};

enum GestationalAgeValues {
  DDM = 'ddm',
  DPA = 'dpa',
}

export enum ADD_INFO_FI_KEY {
  GESTATIONAL_AGE = 'gestational_age',
  GESTATIONAL_AGE_DDM = 'gestational_age_ddm',
  GESTATIONAL_AGE_DPA = 'gestational_age_dpa',
  PRENATAL_DIAGNOSIS = 'prenatal_diagnosis',
  FOETUS_SEX = 'foetus_sex',
  NEW_BORN = 'new_born',
  MOTHER_RAMQ_NUMBER = 'mother_ramq_number',
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

const AdditionalInformation = ({ form, parentKey, showNewBornSection = false }: OwnProps) => {
  const [localShowNewBorn, setLocalShowNewBorn] = useState(showNewBornSection);

  const getName = (key: ADD_INFO_FI_KEY) => getNamePath(parentKey, key);

  useEffect(() => {
    if (localShowNewBorn !== showNewBornSection) {
      setLocalShowNewBorn(showNewBornSection);
    }
  }, [showNewBornSection]);

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
                          dateFormItemProps={{
                            name: getName(ADD_INFO_FI_KEY.GESTATIONAL_AGE_DDM),
                          }}
                          parentFormItemName={getName(ADD_INFO_FI_KEY.GESTATIONAL_AGE)}
                        />
                        <RadioDateFormItem
                          title="Date prévue d'accouchement (DPA)"
                          radioProps={{
                            value: GestationalAgeValues.DPA,
                            name: GestationalAgeValues.DPA,
                          }}
                          dateFormItemProps={{
                            name: getName(ADD_INFO_FI_KEY.GESTATIONAL_AGE_DPA),
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
