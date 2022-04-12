import { Descriptions } from 'antd';
import {
  HISTORY_AND_DIAG_FI_KEY,
  IHealthConditionItem,
} from 'components/Prescription/components/HistoryAndDiagnosisData';
import { usePrescriptionForm } from 'store/prescription';
import { EMPTY_FIELD, STEPS_ID } from '../../constant';

const HistoryAndDiagnosisReview = () => {
  const { analysisData } = usePrescriptionForm();

  const getData = (key: HISTORY_AND_DIAG_FI_KEY) =>
    analysisData[STEPS_ID.HISTORY_AND_DIAGNOSIS]?.[key];

  const getHealthConditions = () =>
    ((getData(HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS) ?? []) as IHealthConditionItem[])
      .map((item) => `${item.condition} (${item.parental_link})`)
      .join(', ');

  return (
    <Descriptions column={1} size="small">
      <Descriptions.Item label="Histoire familiale">{getHealthConditions()}</Descriptions.Item>
      <Descriptions.Item label="Présence de consanguinité">
        {getData(HISTORY_AND_DIAG_FI_KEY.HAS_INBREEDING)}
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
