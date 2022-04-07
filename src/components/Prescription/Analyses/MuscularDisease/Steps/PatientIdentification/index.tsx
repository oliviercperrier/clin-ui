import { Collapse, Form, Space } from 'antd';
import AnalysisForm from 'components/Prescription/Analyses/AnalysisForm';
import PatientDataSearch, {
  InstitutionValue,
  IPatientDataType,
  PATIENT_DATA_FI_KEY,
} from 'components/Prescription/components/PatientDataSearch';
import { getNamePath } from 'components/Prescription/utils/form';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import { useEffect, useState } from 'react';
import {
  ADDITIONAL_INFO_WRAPPER_KEY,
  MuscularDiseaseFormName,
  PATIENT_IDENTIFICATION_NAME_PATH,
} from 'store/prescription/analysis/muscular';
import AdditionalInformation, { ADD_INFO_FI_KEY, IAddInfoDataType } from './AdditionalInformation';

import styles from './index.module.scss';

export interface IPatientFormDataType {
  [MuscularDiseaseFormName.PATIENT_IDENTIFICATION]: IPatientDataType & {
    [ADDITIONAL_INFO_WRAPPER_KEY]: IAddInfoDataType;
  };
}

const PatientIdentification = (props: IAnalysisStepForm) => {
  const [form] = Form.useForm();
  const [ramqSearchDone, setRamqSearchDone] = useState(false);
  const [fileSearchDone, setFileSearchDone] = useState(false);
  const FORM_NAME = props.formName;
  const ADD_INFO_NAME_PATH = PATIENT_IDENTIFICATION_NAME_PATH.ADDITIONAL_INFO_NAME_PATH;

  const getName = (key: string) => getNamePath(FORM_NAME, key);
  const getAddInfoName = (key: string) => getNamePath(ADD_INFO_NAME_PATH, key);

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
              onResetRamq={() => {
                form.resetFields([
                  getAddInfoName(ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS),
                  getAddInfoName(ADD_INFO_FI_KEY.FOETUS_SEX),
                  getAddInfoName(ADD_INFO_FI_KEY.GESTATIONAL_AGE),
                  getAddInfoName(ADD_INFO_FI_KEY.NEW_BORN),
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
                    parentKey={ADD_INFO_NAME_PATH}
                    showNewBornSection={getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_RAMQ))}
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
