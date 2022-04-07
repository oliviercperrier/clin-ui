import { Collapse, Form, Space } from 'antd';
import AnalysisForm from 'components/Prescription/Analyses/AnalysisForm';
import PatientDataSearch, {
  IPatientDataType,
  PATIENT_DATA_FI_KEY,
} from 'components/Prescription/components/PatientDataSearch';
import { getNamePath } from 'components/Prescription/utils/form';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import { useState } from 'react';
import { usePrescriptionForm } from 'store/prescription';
import { MuscularDiseaseFormName } from 'store/prescription/analysis/muscular';
import AdditionalInformation, { ADD_INFO_FI_KEY, IAddInfoDataType } from './AdditionalInformation';

import styles from './index.module.scss';

export type TPatientFormDataContent = IPatientDataType & IAddInfoDataType;
export interface IPatientFormDataType {
  [MuscularDiseaseFormName.PATIENT_IDENTIFICATION]: TPatientFormDataContent;
}

const PatientIdentification = (props: IAnalysisStepForm) => {
  const [form] = Form.useForm();
  const { analysisData } = usePrescriptionForm();
  const [ramqSearchDone, setRamqSearchDone] = useState(false);
  const [fileSearchDone, setFileSearchDone] = useState(false);
  const FORM_NAME = props.formName;

  const getName = (key: string) => getNamePath(FORM_NAME, key);
  const getInitialData = () =>
    analysisData
      ? (analysisData[MuscularDiseaseFormName.PATIENT_IDENTIFICATION] as TPatientFormDataContent)
      : undefined;

  return (
    <AnalysisForm form={form} className={styles.patientIdentificationForm} name={FORM_NAME}>
      <Space direction="vertical" className={styles.formContentWrapper}>
        <Collapse bordered={false} defaultActiveKey={['patient']}>
          <Collapse.Panel key="patient" header="Patient">
            <PatientDataSearch
              form={form}
              parentKey={FORM_NAME}
              onRamqSearchStateChange={setRamqSearchDone}
              onFileSearchStateChange={setFileSearchDone}
              initialFileSearchDone={fileSearchDone}
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
