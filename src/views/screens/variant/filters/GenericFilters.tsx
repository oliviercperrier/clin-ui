import React from 'react';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Layout, Spin } from 'antd';
import { cloneDeep } from 'lodash';
import { useParams } from 'react-router';
import { generateFilters } from 'graphql/utils/Filters';
import { VARIANT_QB_ID } from 'views/screens/variant/constants';
import { MappingResults, useGetVariantAggregations } from 'graphql/variants/actions';
import { VARIANT_AGGREGATION_QUERY } from 'graphql/variants/queries';
import { wrapSqonWithDonorId } from '../utils';
import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';

import styles from './Filters.module.scss';

type OwnProps = {
  field: string;
  mappingResults: MappingResults;
};

const GenericFilters = ({ field, mappingResults }: OwnProps): React.ReactElement => {
  const { patientid } = useParams<{ patientid: string }>();
  const { queryList, activeQuery } = useQueryBuilderState(VARIANT_QB_ID);
  const resolvedSqon = cloneDeep(resolveSyntheticSqon(queryList, activeQuery, 'donors'));

  const results = useGetVariantAggregations(
    {
      sqon: wrapSqonWithDonorId(resolvedSqon, patientid),
    },
    VARIANT_AGGREGATION_QUERY([field], mappingResults),
  );

  return (
    <Spin size="large" spinning={results.loading}>
      <Layout className={`${styles.variantFilterWrapper} ${styles.genericFilterWrapper}`}>
        {generateFilters({
          queryBuilderId: VARIANT_QB_ID,
          aggregations: results?.aggregations,
          extendedMapping: {
            loading: mappingResults.loadingMapping,
            data: mappingResults.extendedMapping,
          },
          className: styles.variantFilterContainer,
          filterFooter: true,
          showSearchInput: true,
          useFilterSelector: true,
        })}
      </Layout>
    </Spin>
  );
};

export default GenericFilters;
