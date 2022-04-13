import { PractitionerRole } from 'api/fhir/models';

export type TUserState = {
  isLoading: boolean;
  user: {
    practitionerRoles: PractitionerRole[];
  };
};
