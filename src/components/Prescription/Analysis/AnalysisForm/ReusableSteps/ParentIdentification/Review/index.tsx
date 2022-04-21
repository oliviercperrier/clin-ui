import { Descriptions, Divider } from 'antd';
import { usePrescriptionForm } from 'store/prescription';
import {
  ClinicalStatusValue,
  EnterInfoMomentValue,
  PARENT_DATA_FI_KEY,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/ParentIdentification';
import ClinicalSignsReview from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/ClinicalSigns/Review/';
import { STEPS_ID } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import PatientIdentificationReview from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/PatientIdentification/Review';
import intl from 'react-intl-universal';

interface OwnProps {
  parent: 'mother' | 'father';
}

const ParentIdentificationReview = ({ parent }: OwnProps) => {
  const { analysisData } = usePrescriptionForm();

  const getStepId = () =>
    parent === 'father' ? STEPS_ID.FATHER_IDENTIFICATION : STEPS_ID.MOTHER_IDENTIFICATION;

  const getData = (key: PARENT_DATA_FI_KEY) => analysisData[getStepId()]?.[key];

  if (getData(PARENT_DATA_FI_KEY.ENTER_INFO_MOMENT) === EnterInfoMomentValue.NOW) {
    const status = getData(PARENT_DATA_FI_KEY.CLINICAL_STATUS);
    const isAffected = status === ClinicalStatusValue.AFFECTED;

    return (
      <>
        <PatientIdentificationReview key={parent} stepId={getStepId()} />
        <Divider style={{ margin: '12px 0' }} />
        <Descriptions column={1} size="small">
          <Descriptions.Item
            label="Status"
            style={isAffected ? { paddingBottom: '8px' } : undefined}
          >
            {intl.get(status ?? '')}
          </Descriptions.Item>
        </Descriptions>
        {isAffected && <ClinicalSignsReview key={parent} stepId={getStepId()} />}
      </>
    );
  }

  return (
    <Descriptions>
      <Descriptions.Item
        label={
          getData(PARENT_DATA_FI_KEY.ENTER_INFO_MOMENT) === EnterInfoMomentValue.NEVER
            ? 'Absence définitive'
            : 'Absence temporaire'
        }
      >
        {getData(PARENT_DATA_FI_KEY.NO_INFO_REASON)}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ParentIdentificationReview;
