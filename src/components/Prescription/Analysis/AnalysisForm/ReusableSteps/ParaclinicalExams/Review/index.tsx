import { Descriptions } from 'antd';
import { PARACLINICAL_EXAMS_FI_KEY } from 'components/Prescription/components/ParaclinicalExamsSelect';
import { usePrescriptionForm } from 'store/prescription';
import {
  EMPTY_FIELD,
  STEPS_ID,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';

const ParaclinicalExamsReview = () => {
  const { analysisData } = usePrescriptionForm();

  const getData = (key: PARACLINICAL_EXAMS_FI_KEY) =>
    analysisData[STEPS_ID.PARACLINICAL_EXAMS]?.[key];

  const getExams = () => getData(PARACLINICAL_EXAMS_FI_KEY.EXAMS);

  return <Descriptions column={1} size="small"></Descriptions>;
};

export default ParaclinicalExamsReview;
