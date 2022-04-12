import { Collapse, Descriptions, Form, Input, Space } from 'antd';
import { getNamePath } from 'components/Prescription/utils/form';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import { usePrescriptionForm } from 'store/prescription';
import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { prescriptionFormActions } from 'store/prescription/slice';
import { defaultFormItemsRules, STEPS_ID } from '../constant';

import styles from './index.module.scss';
import { PATIENT_DATA_FI_KEY } from 'components/Prescription/components/PatientDataSearch';
import { submissionStepMapping } from 'components/Prescription/Analysis/stepMapping';

export enum SUBMISSION_REVIEW_FI_KEY {
  RESPONSIBLE_DOCTOR = 'responsible_doctor',
  GENERAL_COMMENT = 'general_comment',
}

const Submission = ({}: IAnalysisStepForm) => {
  const FORM_NAME = STEPS_ID.SUBMISSION;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { analysisData, config, currentStep, analysisType } = usePrescriptionForm();

  const getName = (...key: string[]) => getNamePath(FORM_NAME, key);

  return (
    <AnalysisForm form={form} className={styles.submissionForm} name={FORM_NAME} layout="vertical">
      <Form.Item
        name={getName(SUBMISSION_REVIEW_FI_KEY.RESPONSIBLE_DOCTOR)}
        label={'Veuillez identifier votre médecin résponsable'}
        wrapperCol={{ xxl: 14 }}
        rules={defaultFormItemsRules}
      >
        <Input suffix={<SearchOutlined />} placeholder="Recherche par nom ou licence…" />
      </Form.Item>
      <Form.Item
        name={getName(SUBMISSION_REVIEW_FI_KEY.GENERAL_COMMENT)}
        label="Commentaire général"
        wrapperCol={{ xxl: 14 }}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
      <Collapse defaultActiveKey={['analyse', ...(config?.steps.map(({ title }) => title) ?? [])]}>
        <Collapse.Panel
          key="analyse"
          header="Analyse"
          extra={
            <FormOutlined
              onClick={(event) => {
                event.stopPropagation();
              }}
            />
          }
        >
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Analyse demandée">{analysisType}</Descriptions.Item>
            <Descriptions.Item label="Établissement préscripteur">
              {
                analysisData[STEPS_ID.PATIENT_IDENTIFICATION]?.[
                  PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION
                ]
              }
            </Descriptions.Item>
          </Descriptions>
        </Collapse.Panel>
        {config?.steps
          .filter(({ title }) => title !== currentStep?.title)
          .map((step) => (
            <Collapse.Panel
              key={step.title}
              header={step.title}
              extra={
                <FormOutlined
                  onClick={(event) => {
                    event.stopPropagation();
                    dispatch(prescriptionFormActions.goTo(step.index!));
                  }}
                />
              }
            >
              {submissionStepMapping[step.id]}
            </Collapse.Panel>
          ))}
      </Collapse>
    </AnalysisForm>
  );
};

export default Submission;
