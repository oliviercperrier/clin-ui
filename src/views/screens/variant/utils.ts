import { TSqonContent } from '@ferlab/ui/core/data/sqon/types';
import { arrayPrepend } from 'utils/array';

export const prependPatientSqon = (content: TSqonContent, patientId: string) => {
  return arrayPrepend(
    {
      content: { field: 'donors.patient_id', value: [patientId] },
      op: 'in',
    },
    content,
  );
};
