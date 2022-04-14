import { Descriptions, Space } from 'antd';
import {
  ClinicalSignsStatus,
  CLINICAL_SIGNS_FI_KEY,
  CLINICAL_SIGNS_ITEM_KEY,
  IClinicalSignItem,
} from 'components/Prescription/components/ClinicalSignsSelect';
import { isEmpty } from 'lodash';
import { usePrescriptionForm } from 'store/prescription';
import {
  EMPTY_FIELD,
  STEPS_ID,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';

interface OwnProps {
  stepId?:
    | STEPS_ID.FATHER_IDENTIFICATION
    | STEPS_ID.MOTHER_IDENTIFICATION
    | STEPS_ID.CLINICAL_SIGNS;
}

const ClinicalSignsReview = ({ stepId = STEPS_ID.CLINICAL_SIGNS }: OwnProps) => {
  const { analysisData } = usePrescriptionForm();

  const getData = (key: CLINICAL_SIGNS_FI_KEY) => analysisData[stepId]?.[key];

  const getSignsByStatus = (status: ClinicalSignsStatus) =>
    ((getData(CLINICAL_SIGNS_FI_KEY.SIGNS) ?? []) as IClinicalSignItem[]).filter(
      (sign) => sign[CLINICAL_SIGNS_ITEM_KEY.STATUS] === status,
    );

  const formatSignsWithAge = (sign: IClinicalSignItem) => (
    <span>{`${sign.term}${sign.onset_age ? ' - ' + sign.onset_age : ''}`}</span>
  );

  const getSignsList = (status: ClinicalSignsStatus) => {
    const observedSigns = getSignsByStatus(status);
    return isEmpty(observedSigns) ? EMPTY_FIELD : observedSigns.map(formatSignsWithAge);
  };

  return (
    <Descriptions column={1} size="small">
      <Descriptions.Item label="Signes observés">
        <Space direction="vertical" size={0}>
          {getSignsList(ClinicalSignsStatus.OBSERVED)}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label="Signes non observés">
        <Space direction="vertical" size={0}>
          {getSignsList(ClinicalSignsStatus.NOT_OBSERVED)}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label="Remarque">
        {getData(CLINICAL_SIGNS_FI_KEY.CLINIC_REMARK) ?? EMPTY_FIELD}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ClinicalSignsReview;
