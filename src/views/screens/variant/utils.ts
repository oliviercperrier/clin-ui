import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';

export const wrapSqonWithDonorId = (resolvedSqon: ISqonGroupFilter, patientId: string) => ({
  content: [
    {
      content: { field: 'donors.patient_id', value: [patientId] },
      op: 'in',
    },
    { ...resolvedSqon },
  ],
  op: 'and',
});
