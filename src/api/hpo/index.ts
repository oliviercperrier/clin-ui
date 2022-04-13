import { sendRequestWithRpt } from 'api';
import { getEnvVariable } from 'utils/config';
import { IHpoPayload } from './models';

const HPO_SERVICE_URL = getEnvVariable('HPO_URL');

const searchHpos = (term: string) =>
  sendRequestWithRpt<IHpoPayload>({
    method: 'GET',
    url: `${HPO_SERVICE_URL}/autocomplete`,
    params: {
      prefix: term,
    },
  });

const searchHpoChildren = (hpoCode: string) =>
  sendRequestWithRpt<IHpoPayload>({
    method: 'GET',
    url: `${HPO_SERVICE_URL}/descendants`,
    params: {
      parentHpoId: hpoCode,
    },
  });

const searchHPOByAncestorId = (hpoId: string, size = 1000, after?: string) =>
  sendRequestWithRpt<IHpoPayload>({
    method: 'GET',
    url: `${HPO_SERVICE_URL}/ancestors`,
    params: {
      hpoId,
      after,
      size,
    },
  });

export const HpoApi = {
  searchHpos,
  searchHPOByAncestorId,
  searchHpoChildren,
};
