import FilterSelector, {
  FilterSelectorProps,
} from '@ferlab/ui/core/components/filters/FilterSelector';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Spin } from 'antd';
import { cloneDeep } from 'lodash';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { MappingResults, useGetVariantAggregations } from 'store/graphql/variants/actions';
import { VARIANT_AGGREGATION_QUERY } from 'store/graphql/variants/queries';
import { VARIANT_REPO_CACHE_KEY } from 'views/screens/variant/constants';

type OwnProps = FilterSelectorProps & {
  filterKey: string;
  mappingResults: MappingResults;
  onDataLoaded: Function;
};

const CustomFilterSelector = ({
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
  const { filters: queryFilters } = useFilters();
  const { patientid } = useParams<{ patientid: string }>();
  const allSqons = getQueryBuilderCache(VARIANT_REPO_CACHE_KEY).state;
  let resolvedSqon = cloneDeep(resolveSyntheticSqon(allSqons, queryFilters));
  resolvedSqon.content.push({
    content: { field: 'donors.patient_id', value: [patientid] },
    op: 'in',
  });

  const results = useGetVariantAggregations(
    {
      sqon: resolvedSqon,
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
