import { Button, Checkbox, Form, Input, Radio, Select, Space } from 'antd';
import { IAnalysisFormPart } from 'components/Prescription/utils/type';
import styles from './index.module.scss';
import { getNamePath } from 'components/Prescription/utils/form';
import LabelWithInfo from 'components/uiKit/form/LabelWithInfo';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import cx from 'classnames';
import { isEmpty } from 'lodash';

type OwnProps = IAnalysisFormPart & {
  initialData?: IHistoryAndDiagnosisDataType;
};

export enum HISTORY_AND_DIAG_FI_KEY {
  REPORT_HEALTH_CONDITIONS = 'report_health_conditions',
  HAS_INBREEDING = 'inbreeding',
  HEALTH_CONDITIONS = 'health_conditions',
  ETHNICITY = 'ethnicity',
  DIAGNOSIS_HYPOTHESIS = 'diagnostic_hypothesis',
  HEALTH_CONDITION_CONDITION = 'condition',
  HEALTH_CONDITION_PARENTAL_LINK = 'parental_link',
}

export enum InbreedingValue {
  YES = 'yes',
  NO = 'no',
  NA = 'not_applicable',
}

export interface IHealthConditionItem {
  [HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITION_CONDITION]: string;
  [HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITION_PARENTAL_LINK]: string;
}

export interface IHistoryAndDiagnosisDataType {
  [HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS]: IHealthConditionItem[];
  [HISTORY_AND_DIAG_FI_KEY.REPORT_HEALTH_CONDITIONS]: boolean;
  [HISTORY_AND_DIAG_FI_KEY.ETHNICITY]: string;
  [HISTORY_AND_DIAG_FI_KEY.HAS_INBREEDING]: boolean;
  [HISTORY_AND_DIAG_FI_KEY.DIAGNOSIS_HYPOTHESIS]: string;
}

const HistoryAndDiagnosticData = ({ parentKey, form, initialData }: OwnProps) => {
  const getName = (...key: string[]) => getNamePath(parentKey, key);

  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      form.setFields(
        Object.entries(initialData).map((value) => ({
          name: getName(value[0]),
          value: value[1],
        })),
      );
    } else {
      form.setFields([
        {
          name: getName(HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS),
          value: [
            {
              condition: '',
              parental_link: undefined,
            },
          ],
        },
      ]);
    }
  }, []);

  return (
    <div className={styles.historyAndDiagnosisHypSelect}>
      <Form.Item label="Histoire familiale">
        <Form.Item
          name={getName(HISTORY_AND_DIAG_FI_KEY.REPORT_HEALTH_CONDITIONS)}
          valuePropName="checked"
          className={styles.familyHistoryFormItem}
        >
          <Checkbox>Rapporter des conditions de santé pertinentes</Checkbox>
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) =>
            getFieldValue(getName(HISTORY_AND_DIAG_FI_KEY.REPORT_HEALTH_CONDITIONS)) ? (
              <Form.Item wrapperCol={{ xxl: 16 }}>
                <LabelWithInfo
                  title="Indiquer au moins une condition de santé et son lien parental"
                  colon
                  requiredMark
                  size="small"
                />
                <Form.List name={getName(HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS)}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Space
                          key={key}
                          className={styles.healthConditionListItem}
                          align="baseline"
                        >
                          <Form.Item {...restField} name={[name, 'condition']}>
                            <Input placeholder="Condition de santé" />
                          </Form.Item>
                          <Form.Item {...restField} name={[name, 'parental_link']}>
                            <Select placeholder="Lien parental"></Select>
                          </Form.Item>
                          <CloseOutlined
                            className={cx(!name ? styles.hidden : '', styles.removeIcon)}
                            onClick={() => remove(name)}
                          />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="link"
                          className={styles.addHealthCondition}
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                        >
                          Ajouter
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            ) : null
          }
        </Form.Item>
      </Form.Item>

      <Form.Item
        label="Présence de consanguinité"
        name={getName(HISTORY_AND_DIAG_FI_KEY.HAS_INBREEDING)}
      >
        <Radio.Group>
          <Radio value={InbreedingValue.NO}>Non</Radio>
          <Radio value={InbreedingValue.YES}>Oui</Radio>
          <Radio value={InbreedingValue.NA}>NA</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="Ethnicité"
        name={getName(HISTORY_AND_DIAG_FI_KEY.ETHNICITY)}
        wrapperCol={{ lg: 8, xl: 8, xxl: 6 }}
      >
        <Select placeholder="Sélectionner" />
      </Form.Item>
      <Form.Item
        label="Hypothèse diagnostique"
        name={getName(HISTORY_AND_DIAG_FI_KEY.DIAGNOSIS_HYPOTHESIS)}
        wrapperCol={{ xxl: 14 }}
      >
        <Input.TextArea rows={3} placeholder="Sélectionner" />
      </Form.Item>
    </div>
  );
};

export default HistoryAndDiagnosticData;
