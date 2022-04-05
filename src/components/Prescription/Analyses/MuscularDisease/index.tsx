import ClinicalSigns from './Steps/ClinicalSigns';
import HistoryAndDiagnosticHypothesis from './Steps/HistoryAndDiagnosticHypothesis';
import ParaclinicalExams from './Steps/ParaclinicalExams';
import PatientIdentification from './Steps/PatientIdentification';
import Submission from './Steps/Submission';
import { usePrescriptionForm } from 'store/prescription';

const MuscularDisease = () => {
  const { currentStep } = usePrescriptionForm();
  //const currentStep = {index: 0}

  switch (currentStep?.index) {
    case 0:
      return <PatientIdentification />;
    case 1:
      return <ClinicalSigns />;
    case 2:
      return <ParaclinicalExams />;
    case 3:
      return <HistoryAndDiagnosticHypothesis />;
    case 4:
      return <Submission />;
    default:
      return <></>;
  }
};

export default MuscularDisease;
