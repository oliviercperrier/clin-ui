import { sendRequest } from 'api';
import { getEnvVariable } from 'utils/config';
import { Rpt } from 'auth/types';
import { appendBearerIfToken } from 'utils/helper';
import { Bundle, Patient } from './models';

const FHIR_SERVICE_URL = getEnvVariable('FHIR_SERVICE_URL');

const checkRamq = (rpt: Rpt, ramq: string) =>
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

export const FhirApi = {
  checkRamq,
};
