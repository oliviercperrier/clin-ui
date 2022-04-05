import FilterSelector, {
  FilterSelectorProps,
} from '@ferlab/ui/core/components/filters/FilterSelector';
import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Spin } from 'antd';
import { cloneDeep } from 'lodash';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { MappingResults, useGetVariantAggregations } from 'graphql/variants/actions';
import { VARIANT_AGGREGATION_QUERY } from 'graphql/variants/queries';
import { wrapSqonWithDonorId } from '../utils';

type OwnProps = FilterSelectorProps & {
  queryBuilderId: string;
  filterKey: string;
  mappingResults: MappingResults;
  onDataLoaded: Function;
};

const CustomFilterSelector = ({
  queryBuilderId,
  filterKey,
  mappingResults,
  dictionary,
  filters,
  filterGroup,
  maxShowing,
  selectedFilters,
  onChange,
  onDataLoaded,
  searchInputVisible,
}: OwnProps) => {
  const { patientid } = useParams<{ patientid: string }>();
  const { queryList, activeQuery } = useQueryBuilderState(queryBuilderId);
  const resolvedSqon = cloneDeep(resolveSyntheticSqon(queryList, activeQuery));

  const results = useGetVariantAggregations(
    {
      sqon: wrapSqonWithDonorId(resolvedSqon, patientid),
    },
    VARIANT_AGGREGATION_QUERY([filterKey], mappingResults),
  );

  useEffect(() => {
    if (results.data) {
      onDataLoaded(results);
    }
    // eslint-disable-next-line
  }, [results.aggregations]);

  return (
    <Spin spinning={results.loading}>
      <FilterSelector
        dictionary={dictionary}
        filterGroup={filterGroup}
        filters={filters}
        maxShowing={maxShowing}
        onChange={onChange}
        searchInputVisible={searchInputVisible}
        selectedFilters={selectedFilters}
      />
    </Spin>
  );
};

export default CustomFilterSelector;
