import ClinicalSigns from './Steps/ClinicalSigns';
import HistoryAndDiagnosticHypothesis from './Steps/HistoryAndDiagnosticHypothesis';
import ParaclinicalExams from './Steps/ParaclinicalExams';
import PatientIdentification from './Steps/PatientIdentification';
import Submission from './Steps/Submission';
import { usePrescriptionForm } from 'store/prescription';
import { Form } from 'antd';

const MuscularDisease = () => {
  const { currentStep, config } = usePrescriptionForm();

  const getCurrentStepForm = () => {
    switch (currentStep?.index) {
      case 0:
        return <PatientIdentification formName={config!.steps[0].formName} />;
      case 1:
        return <ClinicalSigns formName={config!.steps[1].formName} />;
      case 2:
        return <ParaclinicalExams formName={config!.steps[2].formName} />;
      case 3:
        return <HistoryAndDiagnosticHypothesis formName={config!.steps[3].formName} />;
      case 4:
        return <Submission formName={config!.steps[4].formName} />;
      default:
        return <></>;
    }
  };

  return (
    <Form.Provider
      onFormFinish={(formName, info) => {
        // Handle every form submission here
        console.log('Form name: ', formName);
        console.log('Form data: ', info);
      }}
    >
      {getCurrentStepForm()}
    </Form.Provider>
  );
};

export default MuscularDisease;
