import { DocumentNode, TypedDocumentNode } from '@apollo/client';

import { INDEX_EXTENDED_MAPPING, QueryVariable } from 'store/graphql/queries';
import { ExtendedMapping, GqlResults } from 'store/graphql/models';
import { useLazyResultQuery } from 'store/graphql/utils/query';
import { VARIANT_QUERY } from 'store/graphql/variants/queries';
import { VARIANT_INDEX } from 'views/screens/variant/constants';

export type MappingResults = {
  loadingMapping: boolean;
  extendedMapping: ExtendedMapping[];
};

type VariantQueryVariables = QueryVariable & { studiesSize?: number };

export const useGetVariantExtendedMappings = (): MappingResults => {
  const { loading, result } = useLazyResultQuery<any>(INDEX_EXTENDED_MAPPING(VARIANT_INDEX), {
    variables: [],
  });

  return {
    loadingMapping: loading,
    extendedMapping: (result && result[VARIANT_INDEX]?.extended) || null,
  };
};

export const useGetVariantPageData = (variables: VariantQueryVariables) => {
  const { loading, result } = useLazyResultQuery<any>(VARIANT_QUERY, {
    variables: variables,
  });

  return {
    loading,
    data:
      result && result[VARIANT_INDEX]
        ? {
            ...result,
          }
        : null,
  };
};

export const useGetVariantAggregations = (
  variables: VariantQueryVariables,
  query: DocumentNode | TypedDocumentNode,
): GqlResults<any> => {
  const { loading, result } = useLazyResultQuery<any>(query, {
    variables: variables,
  });

  return {
    loading,
    aggregations: (result && result[VARIANT_INDEX].aggregations) || null,
    data: [],
    total: 0,
  };
};
