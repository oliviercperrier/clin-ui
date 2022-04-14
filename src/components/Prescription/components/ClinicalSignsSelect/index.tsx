import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Radio, Select, Space, Typography } from 'antd';
import { IAnalysisFormPart, IGetNamePathParams } from 'components/Prescription/utils/type';
import { clone, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { formatHpoTitleAndCode } from 'utils/hpo';
import cx from 'classnames';
import {
  checkShouldUpdate,
  getNamePath,
  resetFieldError,
  setFieldValue,
  setInitialValues,
} from 'components/Prescription/utils/form';

import styles from './index.module.scss';
import PhenotypeModal from 'components/PhenotypeTree/TransferModal';

const { Text } = Typography;

type OwnProps = IAnalysisFormPart & {
  initialData?: IClinicalSignsDataType;
};

const DEFAULT_HPO_LIST = [
  'Crampes musculaires (HP:0003394)',
  'Faiblesse musculaire (HP:0001324)',
  'Hyperthermie maligne (HP:0001319)',
  'Hypotonie congénitale (HP:0007819)',
  'Insuffisance respiratoire inexpliquée (HP:0002093)',
  "Intolérance à l'effort (HP:0003546)",
  'Myalgies (HP:0003326)',
  'Rhabdomyolyse (HP:0003201)',
  'Retard de développement moteur (HP:0001324)',
  'Cardiomyopathie  (HP:0005012)',
  'Dysphagie (HP:0002015)',
  'Myotonie (HP:0002486)',
  'Ophtalmoplégie (HP:0003348)',
  'Pieds bots (HP:0001879)',
  'Ptose progressive (HP:0007838)',
];

export enum CLINICAL_SIGNS_FI_KEY {
  SIGNS = 'clinical_signs',
  CLINIC_REMARK = 'clinical_clinic_remark',
}

export enum CLINICAL_SIGNS_ITEM_KEY {
  STATUS = 'status',
  ONSET_AGE = 'onset_age',
}

export enum ClinicalSignsStatus {
  OBSERVED = 'observed',
  NOT_OBSERVED = 'not_observed',
  NA = 'not_applicable',
}

export interface IClinicalSignItem {
  term: string;
  [CLINICAL_SIGNS_ITEM_KEY.STATUS]: string;
  [CLINICAL_SIGNS_ITEM_KEY.ONSET_AGE]?: string;
}

export interface IClinicalSignsDataType {
  [CLINICAL_SIGNS_FI_KEY.SIGNS]: IClinicalSignItem[];
  [CLINICAL_SIGNS_FI_KEY.CLINIC_REMARK]?: string;
}

const isDefaultHpo = (hpo: string) => DEFAULT_HPO_LIST.includes(hpo);

const ClinicalSignsSelect = ({ form, parentKey, initialData }: OwnProps) => {
  const [hpoList, setHpoList] = useState(clone(DEFAULT_HPO_LIST));
  const [isPhenotypeModalVisible, setIsPhenotypeModalVisible] = useState(false);

  const getName = (...key: IGetNamePathParams) => getNamePath(parentKey, key);

  const getNode = (index: number): IClinicalSignItem =>
    form.getFieldValue(getName(CLINICAL_SIGNS_FI_KEY.SIGNS))[index];

  const setDefaultList = () =>
    setFieldValue(
      form,
      getName(CLINICAL_SIGNS_FI_KEY.SIGNS),
      hpoList.map((term) => ({ term, status: ClinicalSignsStatus.NA })),
    );

  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      const initialSigns = initialData[CLINICAL_SIGNS_FI_KEY.SIGNS];
      if (initialSigns) {
        setHpoList(initialSigns.map((value) => value.term));
      } else {
        setDefaultList();
      }

      setInitialValues(form, getName, initialData, CLINICAL_SIGNS_FI_KEY);
    } else {
      setDefaultList();
    }
  }, []);

  return (
    <div className={styles.clinicalSignsSelect}>
      <Form.Item>
        <Text className={styles.clinicalSignNotice}>
          Sélectionner <Text type="danger">au moins un (1)</Text> signe clinique{' '}
          <Text type="danger">observé</Text>. Sélectionner les signes{' '}
          <Text type="success">non observés</Text> que vous jugez{' '}
          <Text type="success">pertinents</Text>.
        </Text>
      </Form.Item>
      <Form.Item wrapperCol={{ xxl: 14 }} className="noMarginBtm">
        <Form.List
          name={getName(CLINICAL_SIGNS_FI_KEY.SIGNS)}
          rules={[
            {
              validator: async (_, signs: IClinicalSignItem[]) => {
                if (
                  !signs.some(
                    (sign) => sign[CLINICAL_SIGNS_ITEM_KEY.STATUS] === ClinicalSignsStatus.OBSERVED,
                  )
                ) {
                  return Promise.reject(new Error('Sélectionner au moins un (1) signe clinique'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              <div className={cx(errors.length ? styles.listErrorWrapper : '')}>
                {fields.map(({ key, name, ...restField }) => {
                  const hpoNode = getNode(name);
                  const isDefaultHpoTerm = isDefaultHpo(hpoNode.term);
                  return (
                    <div
                      key={key}
                      className={cx(
                        styles.hpoFormItem,
                        !isDefaultHpoTerm && styles.customHpoFormItem,
                      )}
                    >
                      <Space direction="vertical" className={styles.hpoFormItemContent}>
                        <div className={styles.hpoFormItemTopWrapper}>
                          <Form.Item
                            {...restField}
                            name={[name, CLINICAL_SIGNS_ITEM_KEY.STATUS]}
                            label={formatHpoTitleAndCode({
                              phenotype: hpoNode.term,
                              codeColorType: 'secondary',
                              codeClassName: styles.hpoCode,
                            })}
                          >
                            <Radio.Group
                              onChange={(e) => {
                                if (e.target.value === ClinicalSignsStatus.OBSERVED) {
                                  resetFieldError(form, getName(CLINICAL_SIGNS_FI_KEY.SIGNS));
                                }
                              }}
                            >
                              <Radio value={ClinicalSignsStatus.OBSERVED}>Observé</Radio>
                              <Radio value={ClinicalSignsStatus.NOT_OBSERVED}>Non observé</Radio>
                              {isDefaultHpoTerm && <Radio value={ClinicalSignsStatus.NA}>NA</Radio>}
                            </Radio.Group>
                          </Form.Item>
                          {!isDefaultHpoTerm && (
                            <CloseOutlined
                              className={styles.removeIcon}
                              onClick={() => remove(name)}
                            />
                          )}
                        </div>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prev, next) =>
                            checkShouldUpdate(prev, next, [
                              getName(
                                CLINICAL_SIGNS_FI_KEY.SIGNS,
                                name,
                                CLINICAL_SIGNS_ITEM_KEY.STATUS,
                              ),
                            ])
                          }
                        >
                          {({ getFieldValue }) =>
                            getFieldValue(
                              getName(
                                CLINICAL_SIGNS_FI_KEY.SIGNS,
                                name,
                                CLINICAL_SIGNS_ITEM_KEY.STATUS,
                              ),
                            ) === ClinicalSignsStatus.OBSERVED ? (
                              <Form.Item
                                colon={false}
                                name={[name, CLINICAL_SIGNS_ITEM_KEY.ONSET_AGE]}
                                label={<></>}
                              >
                                <Select placeholder="Âge d'apparition">
                                  <Select.Option value="juvenile">Juvénile</Select.Option>
                                </Select>
                              </Form.Item>
                            ) : null
                          }
                        </Form.Item>
                      </Space>
                    </div>
                  );
                })}
              </div>
              <Form.Item noStyle>
                <Form.ErrorList errors={errors} />
              </Form.Item>
              <Form.Item colon={false} label={<></>}>
                <Button
                  type="link"
                  className={styles.addClinicalSignBtn}
                  onClick={() => setIsPhenotypeModalVisible(true)}
                  icon={<PlusOutlined />}
                >
                  Ajouter un signe clinique
                </Button>
              </Form.Item>
              <PhenotypeModal
                visible={isPhenotypeModalVisible}
                onVisibleChange={setIsPhenotypeModalVisible}
                onApply={(nodes) => {
                  nodes.forEach((node) =>
                    add({ term: node.title, status: ClinicalSignsStatus.OBSERVED }),
                  );
                }}
              />
            </>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item
        wrapperCol={{ xxl: 14 }}
        label="Commentaire clinique général"
        name={getName(CLINICAL_SIGNS_FI_KEY.CLINIC_REMARK)}
        className="noMarginBtm"
      >
        <Input.TextArea rows={3} />
      </Form.Item>
    </div>
  );
};

export default ClinicalSignsSelect;
