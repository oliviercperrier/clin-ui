import { Collapse, Descriptions, Form, Input } from 'antd';
import { getNamePath } from 'components/Prescription/utils/form';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import { usePrescriptionForm } from 'store/prescription';
import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { prescriptionFormActions } from 'store/prescription/slice';
import {
  defaultFormItemsRules,
  STEPS_ID,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { PATIENT_DATA_FI_KEY } from 'components/Prescription/components/PatientDataSearch';
import { submissionStepMapping } from 'components/Prescription/Analysis/stepMapping';
import { useUser } from 'store/user';
import {
  findPractitionerRoleByOrganization,
  isPractitionerResident,
} from 'api/fhir/practitionerHelper';
import LabelWithInfo from 'components/uiKit/form/LabelWithInfo';

import styles from './index.module.scss';

export enum SUBMISSION_REVIEW_FI_KEY {
  RESPONSIBLE_DOCTOR = 'responsible_doctor',
  GENERAL_COMMENT = 'general_comment',
}

const Submission = ({}: IAnalysisStepForm) => {
  const FORM_NAME = STEPS_ID.SUBMISSION;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { user } = useUser();
  const { analysisData, config, currentStep, analysisType } = usePrescriptionForm();

  const getName = (...key: string[]) => getNamePath(FORM_NAME, key);

  const needToSelectSupervisor = () => {
    const org = getPrescribingOrg()!;
    const role = findPractitionerRoleByOrganization(user.practitionerRoles, org);

    return isPractitionerResident(role!) || true;
  };

  const getPrescribingOrg = () =>
    analysisData[STEPS_ID.PATIENT_IDENTIFICATION]?.[PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION];

  return (
    <AnalysisForm form={form} className={styles.submissionForm} name={FORM_NAME} layout="vertical">
      {needToSelectSupervisor() && (
        <Form.Item
          name={getName(SUBMISSION_REVIEW_FI_KEY.RESPONSIBLE_DOCTOR)}
          label={<LabelWithInfo title='Veuillez identifier votre médecin résponsable' colon/>}
          wrapperCol={{ xxl: 14 }}
          rules={defaultFormItemsRules}
        >
          <Input suffix={<SearchOutlined />} placeholder="Recherche par nom ou licence…" />
        </Form.Item>
      )}
      <Form.Item
        name={getName(SUBMISSION_REVIEW_FI_KEY.GENERAL_COMMENT)}
        label={<LabelWithInfo title='Commentaire général' colon/>}
        wrapperCol={{ xxl: 14 }}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
      <Collapse defaultActiveKey={['analyse', ...(config?.steps.map(({ title }) => title) ?? [])]}>
        <Collapse.Panel key="analyse" header="Analyse">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Analyse demandée">{analysisType}</Descriptions.Item>
            <Descriptions.Item label="Établissement préscripteur">
              {getPrescribingOrg()}
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
                    dispatch(
                      prescriptionFormActions.goTo({
                        index: step.index!,
                        lastStepIsNext: true,
                      }),
                    );
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
