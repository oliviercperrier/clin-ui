import { Collapse, Form, Input, Radio, Space, Typography } from 'antd';
import { checkShouldUpdate, getNamePath } from 'components/Prescription/utils/form';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import { usePrescriptionForm } from 'store/prescription';
import { defaultFormItemsRules, STEPS_ID } from '../constant';
import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';

import styles from './index.module.scss';
import PatientDataSearch, {
  PATIENT_DATA_FI_KEY,
} from 'components/Prescription/components/PatientDataSearch';
import ClinicalSignsSelect from 'components/Prescription/components/ClinicalSignsSelect';
import { get } from 'lodash';

type OwnProps = IAnalysisStepForm & {
  parent: 'mother' | 'father';
};

export enum PARENT_DATE_FI_KEY {
  ENTER_INFO_MOMENT = 'enter_moment',
  NO_INFO_REASON = 'no_info_reason',
  CLINICAL_STATUS = 'clinical_status',
}

export enum EnterInfoMomentValue {
  NOW = 'now',
  NEVER = 'never',
  LATER = 'later',
}

export enum ClinicalStatusValue {
  AFFECTED = 'affected',
  NOT_AFFECTED = 'not_affected',
  UNKNOWN = 'unknown',
}

const { Text } = Typography;

const ParentIdentification = ({ parent }: OwnProps) => {
  const FORM_NAME =
    parent === 'father' ? STEPS_ID.FATHER_IDENTIFICATION : STEPS_ID.MOTHER_IDENTIFICATION;
  const [form] = Form.useForm();
  const { analysisData } = usePrescriptionForm();

  const getName = (...key: string[]) => getNamePath(FORM_NAME, key);
  const getInitialData = () => (analysisData ? analysisData[FORM_NAME] : undefined);

  return (
    <AnalysisForm
      key={parent}
      form={form}
      className={styles.parentIdentificationForm}
      name={FORM_NAME}
    >
      <div className={styles.parentInfoChoiceWrapper}>
        <Form.Item>
          <Text>L’analyse demandée requiert l'exomes des parents sauf exception.</Text>
        </Form.Item>
        <Form.Item
          name={getName(PARENT_DATE_FI_KEY.ENTER_INFO_MOMENT)}
          label="Saisir les informations sur la mère"
          rules={defaultFormItemsRules}
        >
          <Radio.Group>
            <Radio value={EnterInfoMomentValue.NOW}>Maintenant</Radio>
            <Radio value={EnterInfoMomentValue.LATER}>Plus tard</Radio>
            <Radio value={EnterInfoMomentValue.NEVER}>Jamais</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => {
            const value = getFieldValue(getName(PARENT_DATE_FI_KEY.ENTER_INFO_MOMENT));
            return value && value !== EnterInfoMomentValue.NOW ? (
              <Form.Item
                label="Justifier l’absence"
                name={getName(PARENT_DATE_FI_KEY.NO_INFO_REASON)}
                className="noMarginBtm"
              >
                <Input.TextArea rows={2} placeholder="Ex: En voyage..." />
              </Form.Item>
            ) : null;
          }}
        </Form.Item>
      </div>
      <Form.Item
        noStyle
        shouldUpdate={(prev, next) =>
          checkShouldUpdate(prev, next, [getName(PARENT_DATE_FI_KEY.ENTER_INFO_MOMENT)])
        }
      >
        {({ getFieldValue }) =>
          getFieldValue(getName(PARENT_DATE_FI_KEY.ENTER_INFO_MOMENT)) ===
          EnterInfoMomentValue.NOW ? (
            <Space direction="vertical" className={styles.formContentWrapper}>
              <Collapse bordered={false} defaultActiveKey={[parent]}>
                <Collapse.Panel key={parent} header="Information du parent">
                  <PatientDataSearch
                    form={form}
                    parentKey={FORM_NAME}
                    initialData={getInitialData()}
                    onResetRamq={() => {}}
                  />
                </Collapse.Panel>
              </Collapse>
            </Space>
          ) : null
        }
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prev, next) =>
          checkShouldUpdate(prev, next, [
            getName(PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION),
            getName(PARENT_DATE_FI_KEY.ENTER_INFO_MOMENT),
            getName(PARENT_DATE_FI_KEY.CLINICAL_STATUS),
          ])
        }
      >
        {({ getFieldValue }) =>
          getFieldValue(getName(PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION)) &&
          getFieldValue(getName(PARENT_DATE_FI_KEY.ENTER_INFO_MOMENT)) ===
            EnterInfoMomentValue.NOW ? (
            <Collapse bordered={false} defaultActiveKey={['additional_information']}>
              <Collapse.Panel key="additional_information" header="Information supplémentaires">
                <Form.Item
                  name={getName(PARENT_DATE_FI_KEY.CLINICAL_STATUS)}
                  label="Status"
                  rules={defaultFormItemsRules}
                >
                  <Radio.Group>
                    <Radio value={ClinicalStatusValue.AFFECTED}>Atteint</Radio>
                    <Radio value={ClinicalStatusValue.NOT_AFFECTED}>Non atteint</Radio>
                    <Radio value={ClinicalStatusValue.UNKNOWN}>Inconnu</Radio>
                  </Radio.Group>
                </Form.Item>
                {getFieldValue(getName(PARENT_DATE_FI_KEY.CLINICAL_STATUS)) ===
                  ClinicalStatusValue.AFFECTED && (
                  <ClinicalSignsSelect form={form} parentKey={FORM_NAME} />
                )}
              </Collapse.Panel>
            </Collapse>
          ) : null
        }
      </Form.Item>
    </AnalysisForm>
  );
};

export default ParentIdentification;
