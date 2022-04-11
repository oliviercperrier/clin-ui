import { Collapse, Form, Space } from 'antd';
import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import PatientDataSearch, {
  IPatientDataType,
  PATIENT_DATA_FI_KEY,
} from 'components/Prescription/components/PatientDataSearch';
import { getNamePath } from 'components/Prescription/utils/form';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import { useState } from 'react';
import { usePrescriptionForm } from 'store/prescription';
import { STEPS_ID } from '../constant';
import AdditionalInformation, { ADD_INFO_FI_KEY, IAddInfoDataType } from './AdditionalInformation';

import styles from './index.module.scss';

export type TPatientFormDataType = IPatientDataType & IAddInfoDataType;

const PatientIdentification = ({}: IAnalysisStepForm) => {
  const FORM_NAME = STEPS_ID.PATIENT_IDENTIFICATION;
  const [form] = Form.useForm();
  const { analysisData } = usePrescriptionForm();
  const [ramqSearchDone, setRamqSearchDone] = useState(false);

  const getName = (...key: string[]) => getNamePath(FORM_NAME, key);
  const getInitialData = () =>
    analysisData ? (analysisData[FORM_NAME] as TPatientFormDataType) : undefined;

  return (
    <AnalysisForm form={form} className={styles.patientIdentificationForm} name={FORM_NAME}>
      <Space direction="vertical" className={styles.formContentWrapper}>
        <Collapse bordered={false} defaultActiveKey={['patient']}>
          <Collapse.Panel key="patient" header="Patient">
            <PatientDataSearch
              form={form}
              parentKey={FORM_NAME}
              onRamqSearchStateChange={setRamqSearchDone}
              initialRamqSearchDone={ramqSearchDone}
              initialData={getInitialData()}
              onResetRamq={() => {
                form.resetFields([
                  getName(ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS),
                  getName(ADD_INFO_FI_KEY.FOETUS_SEX),
                  getName(ADD_INFO_FI_KEY.GESTATIONAL_AGE),
                  getName(ADD_INFO_FI_KEY.NEW_BORN),
                ]);
              }}
            />
          </Collapse.Panel>
        </Collapse>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) =>
            getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_RAMQ)) || ramqSearchDone ? (
              <Collapse bordered={false} defaultActiveKey={['additional_information']}>
                <Collapse.Panel key="additional_information" header="Information supplémentaires">
                  <AdditionalInformation
                    form={form}
                    parentKey={FORM_NAME}
                    showNewBornSection={getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_RAMQ))}
                    initialData={getInitialData()}
                  />
                </Collapse.Panel>
              </Collapse>
            ) : null
          }
        </Form.Item>
      </Space>
    </AnalysisForm>
  );
};

export default PatientIdentification;
