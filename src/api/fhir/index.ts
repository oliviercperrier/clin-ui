import { sendRequest } from 'api';
import { getEnvVariable } from 'utils/config';

const FHIR_SERVICE_URL = getEnvVariable('FHIR_SERVICE_URL');

const checkRamq = <T>(ramq: string) =>
  sendRequest<T>({
    method: 'GET',
    url: `${FHIR_SERVICE_URL}/Patient`,
    params: {
      identifier: ramq,
    },
  });

export const FhirApi = {
  checkRamq,
};
