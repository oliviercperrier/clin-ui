import { v4 as uuid } from 'uuid';
import { PrescriptionResult } from 'store/graphql/prescriptions/models/Prescription';
import { PARENT_TYPE, PATIENT_POSITION, GENDER, UNKNOWN_TAG } from './constants';

// JWT

export const parseJwt = (token: string) => {
  try {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const getUserFirstname = (token: string) => {
  const tokenData = parseJwt(token);
  return tokenData ? tokenData.given_name : null;
};

// NUMBER

export const isNumber = (n: any) => n && !Number.isNaN(n);

export const toExponentialNotation = (numberCandidate: number, fractionDigits = 2) =>
  numberCandidate ? numberCandidate.toExponential(fractionDigits) : numberCandidate;

// STRING

export const toKebabCase = (str: string) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)!
    .map((x: string) => x.toLowerCase())
    .join('-');

// DATE

export const formatTimestampToISODate = (timestamp: number) =>
  new Date(timestamp).toISOString().split('T')[0];

// NAVIGATION

export const navigateTo = (href: string) => {
  /* eslint no-restricted-globals: ["off"] */
  if (top && top.window) {
    // iframe support
    top.window.location.href = href;
  } else {
    window.location.href = href;
  }
};

export const isDevelopmentEnv = () => {
  return process.env.NODE_ENV === 'development';
};

export const getTopBodyElement = () => {
  /* eslint no-restricted-globals: ["off"] */
  if (top && top.window) {
    try {
      return top?.window.document.body;
    } catch {}
  }
  return window.document.body;
};

export const downloadJSONFile = (content: string, filename: string) => {
  const windowToUser = top && top.window ? top.window : window;
  const fileBlob = new Blob([content], { type: 'text/json' });
  const downloadLinkElement = windowToUser.document.createElement('a');
  downloadLinkElement.href = windowToUser.URL.createObjectURL(fileBlob);
  downloadLinkElement.download = filename;
  document.body.appendChild(downloadLinkElement);
  downloadLinkElement.click();
  document.body.removeChild(downloadLinkElement);
};

export const getPatientPosition = (gender: string, position: string) => {
  const loweredPosition = position.toLowerCase() || UNKNOWN_TAG;
  const loweredSex = gender.toLowerCase() || UNKNOWN_TAG;
  if (loweredPosition === PATIENT_POSITION.PARENT && loweredSex !== UNKNOWN_TAG) {
    return loweredSex === GENDER.FEMALE ? PARENT_TYPE.MOTHER : PARENT_TYPE.FATHER;
  }
  return loweredPosition;
};

export const generateAndDownloadNanuqExport = (patients: PrescriptionResult[]) => {
  const changeDateFormat = (date:string) => {
    const splitDate = date.split('-')
    return splitDate.reverse().join('/')
  }
  
  const nanuqFileContent = {
    export_id: uuid(),
    version_id: '1.0',
    test_genomique: 'exome',
    LDM: 'CHU Sainte-Justine',
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
      DDN: changeDateFormat(patientInfo.birthDate),
      sexe: patientInfo.gender.toLowerCase() || UNKNOWN_TAG,
      famille_id: familyInfo.cid,
      position: getPatientPosition(patientInfo.gender, patientInfo.position),
    })),
  };
  downloadJSONFile(
    JSON.stringify(nanuqFileContent, null, 2),
    `${Intl.DateTimeFormat(navigator.language).format(new Date())}-clin-nanuq.json`,
  );
};

export const formatLocus = (start: number, chromosome: string, bound?: number) =>
  `chr${chromosome}:${bound ? `${start - bound}-${start + bound}` : start}`;
