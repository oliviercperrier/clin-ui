import { Descriptions } from 'antd';
import { PARACLINICAL_EXAMS_FI_KEY } from 'components/Prescription/components/ParaclinicalExamsSelect';
import { usePrescriptionForm } from 'store/prescription';
import { STEPS_ID } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';

const ParaclinicalExamsReview = () => {
  const { analysisData } = usePrescriptionForm();

  const getData = (key: PARACLINICAL_EXAMS_FI_KEY) =>
    analysisData[STEPS_ID.PARACLINICAL_EXAMS]?.[key];

  return <Descriptions column={1} size="small"></Descriptions>;
};

export default ParaclinicalExamsReview;
