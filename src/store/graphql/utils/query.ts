import {
  ApolloError,
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  TypedDocumentNode,
  useQuery,
} from '@apollo/client';
import { useEffect, useState } from 'react';

export enum Hits {
  COLLECTION = 'hits.edges',
  SINGLE_ITEM = 'hits.edges[0].node',
  ITEM = 'hits',
}

export interface IBaseQueryResults<TData> {
  error: ApolloError | undefined;
  result: TData | undefined;
  loading: boolean;
}

export const useLazyResultQuery = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>,
): IBaseQueryResults<TData> => {
  const { data, error, loading, previousData } = useQuery<TData, TVariables>(query, options);

  const result = data ? data : previousData;
  return { error, loading, result };
};

/**
 * This hook will perform the query only on component load.
 * This can be usefull for example when working with antd/tabs
 *
 * see example here: /views/screens/variant/Entity/index.tsx
 */
export const useLazyResultQueryOnLoadOnly = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>,
) => {
  const [customOptions, setCustomOptions] = useState<{
    skip?: boolean;
    dataToReturn?: any;
  }>({});
  const { loading, result, error } = useLazyResultQuery(query, {
    ...options,
    skip: options?.skip || customOptions.skip,
  });

  useEffect(() => {
    if (result) {
      setCustomOptions({
        skip: true,
        dataToReturn: result,
      });
    }
  }, [result]);

  return {
    loading,
    data: options?.skip || customOptions?.skip ? customOptions.dataToReturn : result,
    error,
  };
};
