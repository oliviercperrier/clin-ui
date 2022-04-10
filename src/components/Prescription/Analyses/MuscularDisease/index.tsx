import ClinicalSigns from '../AnalysisForm/ReusableSections/ClinicalSigns';
import HistoryAndDiagnosticHypothesis from '../AnalysisForm/ReusableSections/HistoryAndDiagnosticHypothesis';
import ParaclinicalExams from '../AnalysisForm/ReusableSections/ParaclinicalExams';
import PatientIdentification from '../AnalysisForm/ReusableSections/PatientIdentification';
import Submission from '../AnalysisForm/ReusableSections/Submission';
import { usePrescriptionForm } from 'store/prescription';
import { Form } from 'antd';
import { useDispatch } from 'react-redux';
import { prescriptionFormActions } from 'store/prescription/slice';

const MuscularDisease = () => {
  const dispatch = useDispatch();
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
        console.log('Form data: ', info.values);

        dispatch(prescriptionFormActions.saveStepData(info.values));
      }}
    >
      {getCurrentStepForm()}
    </Form.Provider>
  );
};

export default MuscularDisease;
