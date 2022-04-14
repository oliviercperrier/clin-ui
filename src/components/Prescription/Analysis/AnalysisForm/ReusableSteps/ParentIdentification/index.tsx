import { Collapse, Form, Input, Radio, Space, Typography } from 'antd';
import { checkShouldUpdate, getNamePath, setFieldValue } from 'components/Prescription/utils/form';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import { usePrescriptionForm } from 'store/prescription';
import { defaultFormItemsRules, STEPS_ID } from '../constant';
import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import PatientDataSearch, {
  IPatientDataType,
  PATIENT_DATA_FI_KEY,
} from 'components/Prescription/components/PatientDataSearch';
import ClinicalSignsSelect, {
  IClinicalSignsDataType,
} from 'components/Prescription/components/ClinicalSignsSelect';
import intl from 'react-intl-universal';

import styles from './index.module.scss';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';

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

export type TParentDataType = IPatientDataType &
  IClinicalSignsDataType & {
    [PARENT_DATE_FI_KEY.CLINICAL_STATUS]: ClinicalStatusValue;
    [PARENT_DATE_FI_KEY.ENTER_INFO_MOMENT]: EnterInfoMomentValue;
    [PARENT_DATE_FI_KEY.NO_INFO_REASON]: string;
  };

const { Text } = Typography;

const ParentIdentification = ({ parent }: OwnProps) => {
  const FORM_NAME =
    parent === 'father' ? STEPS_ID.FATHER_IDENTIFICATION : STEPS_ID.MOTHER_IDENTIFICATION;
  const [form] = Form.useForm();
  const [ramqSearchDone, setRamqSearchDone] = useState(false);
  const { analysisData } = usePrescriptionForm();

  const getName = (...key: string[]) => getNamePath(FORM_NAME, key);
  const getInitialData = () =>
    analysisData ? (analysisData[FORM_NAME] as TParentDataType) : undefined;

  useEffect(() => {
    const initialData = getInitialData();
    if (initialData && !isEmpty(initialData)) {
      setFieldValue(form, getName(PARENT_DATE_FI_KEY.ENTER_INFO_MOMENT), initialData.enter_moment);
      setFieldValue(form, getName(PARENT_DATE_FI_KEY.NO_INFO_REASON), initialData.no_info_reason);
      setFieldValue(form, getName(PARENT_DATE_FI_KEY.CLINICAL_STATUS), initialData.clinical_status);
    }
  }, []);

  return (
    <AnalysisForm form={form} className={styles.parentIdentificationForm} name={FORM_NAME}>
      <div className={styles.parentInfoChoiceWrapper}>
        <Form.Item>
          <Text>{intl.get('prescription.parent.info.notice')}</Text>
        </Form.Item>
        <Form.Item
          name={getName(PARENT_DATE_FI_KEY.ENTER_INFO_MOMENT)}
          label={intl.get(`prescription.parent.info.moment.${parent}`)}
          rules={defaultFormItemsRules}
        >
          <Radio.Group>
            <Radio value={EnterInfoMomentValue.NOW}>
              {intl.get('prescription.parent.info.moment.options.now')}
            </Radio>
            <Radio value={EnterInfoMomentValue.LATER}>
              {intl.get('prescription.parent.info.moment.options.later')}
            </Radio>
            <Radio value={EnterInfoMomentValue.NEVER}>
              {intl.get('prescription.parent.info.moment.options.never')}
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => {
            const value = getFieldValue(getName(PARENT_DATE_FI_KEY.ENTER_INFO_MOMENT));
            return value && value !== EnterInfoMomentValue.NOW ? (
              <Form.Item
                label={intl.get('prescription.parent.info.moment.justify')}
                name={getName(PARENT_DATE_FI_KEY.NO_INFO_REASON)}
                className="noMarginBtm"
              >
                <Input.TextArea
                  rows={2}
                  placeholder={intl.get('prescription.parent.info.moment.justify.placeholder')}
                />
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
                <Collapse.Panel
                  key={parent}
                  header={intl.get(`prescription.parent.info.title.${parent}`)}
                >
                  <PatientDataSearch
                    form={form}
                    parentKey={FORM_NAME}
                    initialData={getInitialData()}
                    onRamqSearchStateChange={setRamqSearchDone}
                    initialRamqSearchDone={ramqSearchDone}
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
            getName(PARENT_DATE_FI_KEY.ENTER_INFO_MOMENT),
            getName(PARENT_DATE_FI_KEY.CLINICAL_STATUS),
            getName(PATIENT_DATA_FI_KEY.NO_RAMQ),
          ])
        }
      >
        {({ getFieldValue }) =>
          (getFieldValue(getName(PARENT_DATE_FI_KEY.ENTER_INFO_MOMENT)) ===
            EnterInfoMomentValue.NOW &&
            getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_RAMQ))) ||
          ramqSearchDone ? (
            <Collapse bordered={false} defaultActiveKey={['clinical_information']}>
              <Collapse.Panel
                key="clinical_information"
                header={intl.get(`prescription.parent.info.clinical.title.${parent}`)}
              >
                <Form.Item
                  name={getName(PARENT_DATE_FI_KEY.CLINICAL_STATUS)}
                  label="Status"
                  rules={defaultFormItemsRules}
                >
                  <Radio.Group>
                    <Radio value={ClinicalStatusValue.AFFECTED}>
                      {intl.get('prescription.parent.info.clinicalstatus.options.affected')}
                    </Radio>
                    <Radio value={ClinicalStatusValue.NOT_AFFECTED}>
                      {intl.get('prescription.parent.info.clinicalstatus.options.notaffected')}
                    </Radio>
                    <Radio value={ClinicalStatusValue.UNKNOWN}>
                      {intl.get('prescription.parent.info.clinicalstatus.options.unknown')}
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                {getFieldValue(getName(PARENT_DATE_FI_KEY.CLINICAL_STATUS)) ===
                  ClinicalStatusValue.AFFECTED && (
                  <ClinicalSignsSelect
                    form={form}
                    parentKey={FORM_NAME}
                    initialData={getInitialData()}
                  />
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
