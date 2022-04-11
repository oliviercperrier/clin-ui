import { Button, Checkbox, Form, Input, Radio, Select, Space } from 'antd';
import { IAnalysisFormPart } from 'components/Prescription/utils/type';
import styles from './index.module.scss';
import { getNamePath, resetFieldError } from 'components/Prescription/utils/form';
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

const hiddenLabelConfig = { colon: false, label: <></> };

const HistoryAndDiagnosticData = ({ parentKey, form, initialData }: OwnProps) => {
  const getName = (...key: (string | number)[]) => getNamePath(parentKey, key);

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
        {
          name: getName(HISTORY_AND_DIAG_FI_KEY.HAS_INBREEDING),
          value: InbreedingValue.NA,
        },
      ]);
    }
  }, []);

  const resetListError = () => {
    form.setFields([
      {
        name: getName(HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS),
        errors: [],
      },
    ]);
  };

  return (
    <div className={styles.historyAndDiagnosisHypSelect}>
      <Form.Item noStyle>
        <Form.Item
          label="Histoire familiale"
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
                <Form.Item {...hiddenLabelConfig} className="noMarginBtm">
                  <LabelWithInfo
                    title="Indiquer au moins une condition de santé et son lien parental"
                    colon
                    requiredMark
                    size="small"
                  />
                </Form.Item>
                <Form.List
                  name={getName(HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS)}
                  rules={[
                    {
                      validator: async (_, conditions: IHealthConditionItem[]) => {
                        if (
                          !conditions.some(
                            (condition) =>
                              condition[HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITION_CONDITION] &&
                              condition[HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITION_PARENTAL_LINK],
                          )
                        ) {
                          return Promise.reject(new Error('Entrer au moins 1 condition de santé'));
                        }
                      },
                    },
                  ]}
                >
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      <div className={cx(errors.length ? styles.listErrorWrapper : '')}>
                        {fields.map(({ key, name, ...restField }) => (
                          <Form.Item {...hiddenLabelConfig} className="noMarginBtm">
                            <Space
                              key={key}
                              className={styles.healthConditionListItem}
                              align="baseline"
                            >
                              <Form.Item
                                {...restField}
                                name={[name, HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITION_CONDITION]}
                              >
                                <Input placeholder="Condition de santé" onChange={resetListError} />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[
                                  name,
                                  HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITION_PARENTAL_LINK,
                                ]}
                              >
                                <Select placeholder="Lien parental" onChange={resetListError}>
                                  <Select.Option value="aa">aa</Select.Option>
                                </Select>
                              </Form.Item>
                              <CloseOutlined
                                className={cx(!name ? styles.hidden : '', styles.removeIcon)}
                                onClick={() => remove(name)}
                              />
                            </Space>
                          </Form.Item>
                        ))}
                      </div>
                      <Form.Item noStyle>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                      {getFieldValue(
                        getName(
                          HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS,
                          0,
                          HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITION_CONDITION,
                        ),
                      ) &&
                        getFieldValue(
                          getName(
                            HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS,
                            0,
                            HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITION_PARENTAL_LINK,
                          ),
                        ) && (
                          <Form.Item {...hiddenLabelConfig} className="noMarginBtm">
                            <Button
                              type="link"
                              className={styles.addHealthCondition}
                              onClick={() => add({ condition: '', parental_link: undefined })}
                              icon={<PlusOutlined />}
                            >
                              Ajouter
                            </Button>
                          </Form.Item>
                        )}
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
        rules={[{ required: true, validateTrigger: 'onSubmit' }]}
        className="noMarginBtm"
      >
        <Input.TextArea rows={3} placeholder="Sélectionner" />
      </Form.Item>
    </div>
  );
};

export default HistoryAndDiagnosticData;
