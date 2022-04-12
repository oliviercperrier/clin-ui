import { sendRequest, sendRequestWithRpt } from 'api';
import { getEnvVariable } from 'utils/config';
import { Rpt } from 'auth/types';
import { appendBearerIfToken } from 'utils/helper';
import { Bundle, Patient } from './models';
import { getFhirPractitionerId } from 'auth/keycloak';

const FHIR_SERVICE_URL = getEnvVariable('FHIR_SERVICE_URL');
const HPO_SERVICE_URL = getEnvVariable('HPO_URL');

const searchPatient = (rpt: Rpt, ramq: string) =>
  sendRequest<Bundle<Patient>>({
    method: 'GET',
    url: `${FHIR_SERVICE_URL}/Patient`,
    headers: {
      Authorization: appendBearerIfToken(rpt),
    },
    params: {
      identifier: ramq,
    },
  });

const searchHpos = (term: string) =>
  sendRequestWithRpt<any>({
    method: 'GET',
    url: `${HPO_SERVICE_URL}/autocomplete`,
    params: {
      prefix: term,
    },
  });

const searchHpoChildren = (hpoCode: string) =>
  sendRequestWithRpt<any>({
    method: 'GET',
    url: `${HPO_SERVICE_URL}/descendants`,
    params: {
      parentHpoId: hpoCode,
    },
  });

const searchHPOByAncestorId = (hpoId: string, size = 1000, after?: string) =>
  sendRequestWithRpt<any>({
    method: 'GET',
    url: `${HPO_SERVICE_URL}/ancestors`,
    params: {
      hpoId,
      after,
      size,
    },
  });

const searchPractitionerRole = () =>
  sendRequestWithRpt<any>({
    method: 'GET',
    url: `${FHIR_SERVICE_URL}/PractitionerRole`,
    params: {
      practitioner: getFhirPractitionerId(),
      _include: 'PractitionerRole:practitioner',
    },
  });

export const FhirApi = {
  searchPatient,
  searchHpos,
  searchHPOByAncestorId,
  searchHpoChildren,
  searchPractitionerRole,
};
