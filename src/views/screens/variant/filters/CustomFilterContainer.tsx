import React, { useState } from 'react';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import { IDictionary, IFilter, IFilterGroup } from '@ferlab/ui/core/components/filters/types';
import { getSelectedFilters } from '@ferlab/ui/core/data/sqon/utils';
import { ExtendedMapping, GqlResults } from 'graphql/models';
import { getFilterGroup, getFilters } from 'graphql/utils/Filters';
import { underscoreToDot } from '@ferlab/ui/core/data/arranger/formatting';
import { MappingResults } from 'graphql/variants/actions';
import intl from 'react-intl-universal';
import { updateActiveQueryFilters } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import CustomFilterSelector from './CustomFilterSelector';

type OwnProps = {
  queryBuilderId: string;
  classname: string;
  filterKey: string;
  mappingResults: MappingResults;
  filtersOpen: boolean;
};

const CustomFilterContainer = ({
  queryBuilderId,
  classname,
  filterKey,
  filtersOpen,
  mappingResults,
}: OwnProps) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [results, setResults] = useState<GqlResults<any>>();
  const found = (mappingResults?.extendedMapping || []).find(
    (f: ExtendedMapping) => f.field === underscoreToDot(filterKey),
  );

  const onChange = (fg: IFilterGroup, f: IFilter[]) => {
    updateActiveQueryFilters({
      queryBuilderId,
      filterGroup: fg,
      selectedFilters: f,
    });
  };

  const aggregations = results?.aggregations ? results?.aggregations[filterKey] : {};
  const filterGroup = getFilterGroup(found, aggregations, [], true);
  const filters = results?.aggregations ? getFilters(results?.aggregations, filterKey) : [];
  const selectedFilters = results?.data
    ? getSelectedFilters({
        queryBuilderId,
        filters,
        filterGroup,
      })
    : [];

  const dictionary: IDictionary = {
    actions: {
      all: intl.get('screen.patientvariant.filter.selection.all'),
      none: intl.get('screen.patientvariant.filter.selection.none'),
      apply: intl.get('querybuilder.filters.actions.apply'),
      clear: intl.get('querybuilder.filters.actions.clear'),
      more: intl.get('querybuilder.filters.actions.more'),
      less: intl.get('querybuilder.filters.actions.less'),
    },
    operators: {
      between: intl.get('querybuilder.filters.operators.between'),
      lessThan: intl.get('querybuilder.filters.operators.lessthan'),
      lessThanOfEqual: intl.get('querybuilder.filters.operators.lessthanorequal'),
      greaterThan: intl.get('querybuilder.filters.operators.greaterthan'),
      greaterThanOrEqual: intl.get('querybuilder.filters.operators.greaterthanorequal'),
    },
    range: {
      is: intl.get('querybuilder.filters.range.is'),
      min: 'min',
      max: 'max',
    },
  };

  return (
    <div className={classname} key={`${filterKey}_${filtersOpen}`}>
      <FilterContainer
        maxShowing={5}
        isOpen={filtersOpen}
        filterGroup={filterGroup}
        filters={filters}
        onChange={() => {}}
        selectedFilters={selectedFilters}
        onSearchVisibleChange={setIsSearchVisible}
        collapseProps={{
          headerBorderOnly: true
        }}
        customContent={
          <CustomFilterSelector
            queryBuilderId={queryBuilderId}
            dictionary={dictionary}
            filters={filters}
            filterGroup={filterGroup}
            maxShowing={5}
            onChange={onChange}
            filterKey={filterKey}
            mappingResults={mappingResults}
            selectedFilters={selectedFilters}
            searchInputVisible={isSearchVisible}
            onDataLoaded={setResults}
          />
        }
      />
    </div>
  );
};

export default CustomFilterContainer;
