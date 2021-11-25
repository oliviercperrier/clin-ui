import { useEffect, useState } from "react";
import {
  useLazyResultQuery,
  useLazyResultQueryOnLoadOnly,
} from "store/graphql/utils/query";

import {
  TAB_CLINICAL_QUERY,
  TAB_FREQUENCIES_QUERY,
  TAB_SUMMARY_QUERY,
  TAB_PATIENT_QUERY,
} from "./queries";

export const buildVariantIdSqon = (id: string) => ({
  op: "and",
  content: [
    {
      op: "in",
      content: {
        field: "hash",
        value: id,
      },
    },
  ],
});

export const useTabFrequenciesData = (variantId: string) => {
  const { loading, data, error } = useLazyResultQueryOnLoadOnly(
    TAB_FREQUENCIES_QUERY,
    {
      variables: {
        sqon: buildVariantIdSqon(variantId),
      },
    }
  );

  const nodeVariant = data?.Variants?.hits?.edges[0]?.node;

  return {
    loading,
    data: {
      frequencies: nodeVariant?.frequencies || {},
      frequencies_by_lab: nodeVariant?.frequencies_by_lab || {},
      locus: nodeVariant?.locus || "",
      participantTotalNumber: nodeVariant?.participant_total_number || 0,
      participantNumber: nodeVariant?.participant_number || 0,
      participant_ids: nodeVariant?.participant_ids || [],
    },
    error,
  };
};

export const useTabSummaryData = (variantId: string) => {
  const { loading, data, error } = useLazyResultQueryOnLoadOnly(
    TAB_SUMMARY_QUERY,
    {
      variables: {
        sqon: buildVariantIdSqon(variantId),
      },
    }
  );

  return {
    loading,
    data: data?.Variants?.hits?.edges[0]?.node,
    error,
  };
};

export const useTabClinicalData = (variantId: string) => {
  const { loading, data, error } = useLazyResultQueryOnLoadOnly(
    TAB_CLINICAL_QUERY,
    {
      variables: {
        sqon: buildVariantIdSqon(variantId),
      },
    }
  );
  return { loading, data: data?.Variants?.hits?.edges[0]?.node || {}, error };
};

export const useTabPatientData = (variantId: string) => {
  const { loading, data, error } = useLazyResultQueryOnLoadOnly(
    TAB_PATIENT_QUERY,
    {
      variables: {
        sqon: buildVariantIdSqon(variantId),
      },
    }
  );

  return {
    loading,
    data: data?.Variants?.hits?.edges[0]?.node || {},
    error,
  };
};
