import { TSqonContent } from '@ferlab/ui/core/data/sqon/types';

export const prependPatientSqon = (content: TSqonContent, patientId: string) => [
  {
    content: { field: 'donors.patient_id', value: [patientId] },
    op: 'in',
  },
  ...content,
];
