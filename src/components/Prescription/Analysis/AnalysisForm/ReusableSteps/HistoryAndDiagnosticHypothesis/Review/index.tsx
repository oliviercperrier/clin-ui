import { Descriptions } from 'antd';
import {
  HISTORY_AND_DIAG_FI_KEY,
  IHealthConditionItem,
} from 'components/Prescription/components/HistoryAndDiagnosisData';
import { usePrescriptionForm } from 'store/prescription';
import intl from 'react-intl-universal';
import {
  STEPS_ID,
  EMPTY_FIELD,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { isEmpty } from 'lodash';

const HistoryAndDiagnosisReview = () => {
  const { analysisData } = usePrescriptionForm();

  const getData = (key: HISTORY_AND_DIAG_FI_KEY) =>
    analysisData[STEPS_ID.HISTORY_AND_DIAGNOSIS]?.[key];

  const getHealthConditions = () => {
    const conditions = getData(HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS);
    return isEmpty(conditions)
      ? EMPTY_FIELD
      : (conditions as IHealthConditionItem[])
          .map((item) => `${item.condition} (${item.parental_link})`)
          .join(', ');
  };

  return (
    <Descriptions column={1} size="small">
      <Descriptions.Item label="Histoire familiale">{getHealthConditions()}</Descriptions.Item>
      <Descriptions.Item label="Présence de consanguinité">
        {intl.get((getData(HISTORY_AND_DIAG_FI_KEY.HAS_INBREEDING) as string) ?? 'no')}
      </Descriptions.Item>
      <Descriptions.Item label="Ethnicité">
        {getData(HISTORY_AND_DIAG_FI_KEY.ETHNICITY) ?? EMPTY_FIELD}
      </Descriptions.Item>
      <Descriptions.Item label="Hypothèse diagnostique">
        {getData(HISTORY_AND_DIAG_FI_KEY.DIAGNOSIS_HYPOTHESIS)}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default HistoryAndDiagnosisReview;
