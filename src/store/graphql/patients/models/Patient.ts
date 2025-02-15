import { ArrangerNodeData, ArrangerResultsTree } from 'store/graphql/models';

export interface Requests extends ArrangerNodeData {
  prescription: string;
  request: string;
  status: string;
  submitted: string;
  test: string;
}

export interface Organization extends ArrangerNodeData {
  cid: string;
  name: string;
}

export interface HealthProfessional extends ArrangerNodeData {
  cid: string;
  firstName: string;
  lastName: string;
  lastNameFirstName?: string;
}

export interface PatientResult extends ArrangerNodeData {
  score: string;
  birthDate: string;
  bloodRelationship: string;
  ethnicity: string;
  familyId: string;
  familyType: string;
  fetus: string;
  firstName: string;
  gender: string;
  lastName: string;
  mrn: string;
  position: string;
  ramq: string;
  timestamp: string;
  cidText: string;
  organization: Organization;
  requests: ArrangerResultsTree<Requests>;
  practitioner: ArrangerResultsTree<HealthProfessional>;
}
