import { ArrangerNodeData, ArrangerResultsTree } from 'graphql/models';

export interface Requests extends ArrangerNodeData {
  status: string;
  submitted: string;
  analysis: {
    code: string;
    display: string;
  };
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

export type ITablePatientResult = PatientResult & {
  key: string;
};

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
  mrn: string[];
  position: string;
  ramq: string;
  timestamp: string;
  cidText: string;
  organization: Organization;
  requests: ArrangerResultsTree<Requests>;
  practitioner: ArrangerResultsTree<HealthProfessional>;
}

export interface FhirDocAttachment {
  hash: string;
  title: string;
  url: string;
}

export interface FhirDocContent {
  format: string;
  attachment: FhirDocAttachment;
}

export interface FhirDoc {
  id: string;
  type: string;
  sample: {
    value: string;
  };
  content: FhirDocContent[];
}

export interface PatientFileResults {
  id: string;
  docs: FhirDoc[];
}
