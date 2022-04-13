import { createAsyncThunk } from '@reduxjs/toolkit';
import { FhirApi } from 'api/fhir';
import { PractitionerRole } from 'api/fhir/models';

const fetchPractitionerRole = createAsyncThunk<PractitionerRole[]>(
  'user/searchPractitionerRole',
  async () => {
    const { data } = await FhirApi.searchPractitionerRole();
    return data ? data.entry.map((entry) => entry.resource!) : [];
  },
);

export { fetchPractitionerRole };
