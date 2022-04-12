import { PractitionerRole } from './models';

const RESIDENT_CODE = '405277009';

export const isPractitionerResident = (role: PractitionerRole): boolean => {
  return role && role.code.some((r) => r.coding?.find((coding) => coding.code === RESIDENT_CODE));
};
