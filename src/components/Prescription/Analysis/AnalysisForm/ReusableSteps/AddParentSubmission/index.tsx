import { Form } from 'antd';
import { usePrescriptionForm } from 'store/prescription';
import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import { FormOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { prescriptionFormActions } from 'store/prescription/slice';
import {
  defaultCollapseProps,
  STEPS_ID,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { SubmissionStepMapping } from 'components/Prescription/Analysis/stepMapping';
import PrescriptionSummary from 'components/Prescription/AddParentModal/PrescriptionSummary';
import Collapse, { CollapsePanel } from '@ferlab/ui/core/components/Collapse';

import styles from './index.module.scss';

export enum SUBMISSION_REVIEW_FI_KEY {
  RESPONSIBLE_DOCTOR = 'responsible_doctor',
  GENERAL_COMMENT = 'general_comment',
}

const AddParentSubmission = () => {
  const FORM_NAME = STEPS_ID.SUBMISSION;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { config, currentStep } = usePrescriptionForm();

  return (
    <AnalysisForm
      form={form}
      className={styles.addParentSubmissionForm}
      name={FORM_NAME}
      layout="vertical"
      onFinish={() => {
        console.log('Format and send data to backend');
      }}
    >
      <Form.Item>
        <Collapse {...defaultCollapseProps} defaultActiveKey={['prescription_summary']}>
          <CollapsePanel key={'prescription_summary'} header="Informations sur l'analyse">
            <PrescriptionSummary />
          </CollapsePanel>
        </Collapse>
      </Form.Item>
      <Form.Item
        label={'Veuillez vérifier les informations ci-dessous avant de soumettre le formulaire.'}
        className="noMarginBtm"
      >
        <Collapse
          {...defaultCollapseProps}
          defaultActiveKey={[...(config?.steps.map(({ title }) => title) ?? [])]}
        >
          {config?.steps
            .filter(({ title }) => title !== currentStep?.title)
            .map((step) => (
              <CollapsePanel
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
                {SubmissionStepMapping[step.id]}
              </CollapsePanel>
            ))}
        </Collapse>
      </Form.Item>
    </AnalysisForm>
  );
};

export default AddParentSubmission;
