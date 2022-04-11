import { Space, Steps, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';

import styles from './index.module.scss';

const { Title } = Typography;

const StepsPanel = () => {
  const dispatch = useDispatch();
  const { config, currentStep } = usePrescriptionForm();

  return (
    <Space direction="vertical" size={24} className={styles.prescriptionStepsPanel}>
      <Space direction="vertical" size={3}>
        <Title className={styles.analyseTitle}>Analyse</Title>
        <Title level={4}>{config?.analysisTitle}</Title>
      </Space>
      <Steps direction="vertical" size="small" current={currentStep?.index}>
        {config?.steps.map((step) => (
          <Steps.Step
            // TODO remove after development
            onStepClick={(index) => {
              dispatch(prescriptionFormActions.goTo(index));
            }}
            className={styles.stepsItem}
            key={step.index}
            title={step.title}
          />
        ))}
      </Steps>
    </Space>
  );
};

export default StepsPanel;
