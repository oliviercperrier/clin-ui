import { Button, Tooltip, Modal, Typography, message } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';
import { PrescriptionResult } from 'store/graphql/prescriptions/models/Prescription';
import { ACTIVE_STATUS } from 'utils/constants';
import { getTopBodyElement } from 'utils/helper';
import { FileTextOutlined } from '@ant-design/icons';
import { v4 as uuid } from 'uuid';
import { getPatientPosition, downloadJSONFile } from 'utils/helper';
import { UNKNOWN_TAG } from 'utils/constants';
import { PatientResult } from 'store/graphql/patients/models/Patient';

interface Props {
  selectedPrescription: PrescriptionResult[];
}
const MAX_PRESCRIPTION = 96;
const FETUS_DDN = '11/11/1111';


const formatBirthDateForNanuq = (patientInfo: PatientResult) => {
  if (patientInfo.fetus) {
    return FETUS_DDN;
  }
  const splitDate = patientInfo.birthDate.split('-');
  return splitDate.reverse().join('/');
};

const getDatePadValue = (n: number) => `${n}`.padStart(2, '0');

const formatDateToLocalString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = getDatePadValue(date.getMonth());
  const day = getDatePadValue(date.getDate());
  const hour = getDatePadValue(date.getHours());
  const minute = getDatePadValue(date.getMinutes());
  const seconde = getDatePadValue(date.getSeconds());
  return `${year}-${month}-${day}T${hour}_${minute}_${seconde}`;
};

const generateAndDownloadNanuqExport = (patients: PrescriptionResult[]) => {
  const nanuqFileContent = {
    export_id: uuid(),
    version_id: '1.0',
    test_genomique: 'exome',
    LDM: patients[0].laboratory.split('/')[1],
    patients: patients.map(({ patientInfo, familyInfo, cid }) => ({
      type_echantillon: 'ADN',
      tissue_source: 'Sang',
      type_specimen: 'Normal',
      nom_patient: patientInfo.lastName,
      prenom_patient: patientInfo.firstName,
      patient_id: patientInfo.cid,
      service_request_id: cid,
      dossier_medical: patientInfo.ramq || '--',
      institution: patientInfo.organization.cid,
      DDN: formatBirthDateForNanuq(patientInfo),
      sexe: patientInfo.gender.toLowerCase() || UNKNOWN_TAG,
      famille_id: familyInfo.cid,
      position: getPatientPosition(patientInfo.gender, patientInfo.position),
    })),
  };
  downloadJSONFile(
    JSON.stringify(nanuqFileContent, null, 2),
    `${formatDateToLocalString()}-clin-nanuq.json`,
  );
};

const handleGenerateExportNanuq = (selectedPrescription: PrescriptionResult[]) => {
  const statusError = selectedPrescription.find((p: PrescriptionResult) => p.status !== ACTIVE_STATUS);
  const numberError = selectedPrescription.length > MAX_PRESCRIPTION
  if (statusError || numberError) {
    Modal.error({
      title: intl.get('screen.patientsearch.table.nanuq.modal.title'),
      content: (
        <div>
          <Typography.Text>
            {intl.get('screen.patientsearch.table.nanuq.modal.description')}
          </Typography.Text>
          <ul>
            {statusError && (
              <li>{intl.get(`screen.patientsearch.table.nanuq.modal.status`)}</li>
            )}
            {numberError && (
              <li>
                {intl.get(`screen.patientsearch.table.nanuq.modal.number`)} (
                {selectedPrescription.length})
              </li>
            )}
          </ul>
        </div>
      ),
    });
  } else {
    generateAndDownloadNanuqExport(selectedPrescription);
    message.success({
      content: intl.get('screen.patientsearch.table.nanuq.modal.success'),
      getPopupContainer: () => getTopBodyElement(),
    });
  }
};

const NanuqExportButton = ({ selectedPrescription }: Props): React.ReactElement => {
  return (
    <Tooltip title={intl.get('screen.patientsearch.table.nanuq.tootip')}>
      <Button
        disabled={!selectedPrescription.length}
        size="small"
        type="link"
        icon={<FileTextOutlined height="14" width="14" />}
        onClick={() => {
          handleGenerateExportNanuq(selectedPrescription);
        }}
      >
        {intl.get('screen.patientsearch.table.nanuq')}
      </Button>
    </Tooltip>
  );
};

export default NanuqExportButton;
