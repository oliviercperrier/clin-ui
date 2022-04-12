import { Descriptions } from 'antd';
import { PATIENT_DATA_FI_KEY } from 'components/Prescription/components/PatientDataSearch';
import { usePrescriptionForm } from 'store/prescription';
import { EMPTY_FIELD, STEPS_ID } from '../../constant';

const PatientIdentificationReview = () => {
  const { analysisData } = usePrescriptionForm();

  const getData = (key: PATIENT_DATA_FI_KEY) =>
    analysisData[STEPS_ID.PATIENT_IDENTIFICATION]?.[key];

  const getFileNumber = () => {
    const fileNumber = getData(PATIENT_DATA_FI_KEY.FILE_NUMBER);
    const institution = getData(PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION);
    return fileNumber ? `${fileNumber} - ${institution}` : EMPTY_FIELD;
  };

  const getName = () => {
    const firstName = getData(PATIENT_DATA_FI_KEY.FIRST_NAME);
    const lastName = getData(PATIENT_DATA_FI_KEY.LAST_NAME);
    return `${firstName} ${lastName}`;
  };

  return (
    <Descriptions column={1} size="small">
      <Descriptions.Item label="Dossier">{getFileNumber()}</Descriptions.Item>
      <Descriptions.Item label="RAMQ">
        {getData(PATIENT_DATA_FI_KEY.RAMQ_NUMBER) ?? EMPTY_FIELD}
      </Descriptions.Item>
      <Descriptions.Item label="Nom">{getName()}</Descriptions.Item>
      <Descriptions.Item label="Date de naissance">
        {getData(PATIENT_DATA_FI_KEY.BIRTH_DATE)}
      </Descriptions.Item>
      <Descriptions.Item label="Sexe">{getData(PATIENT_DATA_FI_KEY.SEX)}</Descriptions.Item>
    </Descriptions>
  );
};

export default PatientIdentificationReview;
