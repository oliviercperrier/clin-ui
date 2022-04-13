import { sendRequestWithRpt } from 'api';
import { getEnvVariable } from 'utils/config';
import { Rpt } from 'auth/types';
import { Bundle, Patient, PractitionerRole } from './models';
import { getFhirPractitionerId } from 'auth/keycloak';

const FHIR_SERVICE_URL = getEnvVariable('FHIR_SERVICE_URL');

const searchPatient = (rpt: Rpt, ramq: string) =>
  sendRequestWithRpt<Bundle<Patient>>({
    method: 'GET',
    url: `${FHIR_SERVICE_URL}/Patient`,
    params: {
      identifier: ramq,
    },
  });

const searchPractitionerRole = () =>
  sendRequestWithRpt<Bundle<PractitionerRole>>({
    method: 'GET',
    url: `${FHIR_SERVICE_URL}/PractitionerRole`,
    params: {
      practitioner: getFhirPractitionerId(),
      _include: 'PractitionerRole:practitioner',
    },
  });

export const FhirApi = {
  searchPatient,
  searchPractitionerRole,
};
