import React, { useState } from "react";
import FilterContainer from "@ferlab/ui/core/components/filters/FilterContainer";
import {
  IDictionary,
  IFilter,
  IFilterGroup,
} from "@ferlab/ui/core/components/filters/types";
import {
  getSelectedFilters,
  updateFilters,
} from "@ferlab/ui/core/data/filters/utils";

import { ExtendedMapping, GqlResults } from "store/graphql/models";

import { getFilterGroup, getFilters } from "store/graphql/utils/Filters";
import history from "utils/history";
import { underscoreToDot } from "@ferlab/ui/core/data/arranger/formatting";
import { MappingResults } from "store/graphql/variants/actions";
import intl from "react-intl-universal";

import CustomFilterSelector from "./CustomFilterSelector";

type OwnProps = {
  classname: string;
  filterKey: string;
  mappingResults: MappingResults;
  filtersOpen: boolean;
};

const CustomFilterContainer = ({
  classname,
  filterKey,
  filtersOpen,
  mappingResults,
}: OwnProps) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [results, setResults] = useState<GqlResults<any>>();
  const found = (mappingResults?.extendedMapping || []).find(
    (f: ExtendedMapping) => f.field === underscoreToDot(filterKey)
  );

  const onChange = (fg: IFilterGroup, f: IFilter[]) => {
    updateFilters(history, fg, f);
  };

  const aggregations = results?.aggregations
    ? results?.aggregations[filterKey]
    : {};
  const filterGroup = getFilterGroup(found, aggregations, [], true);
  const filters = results?.data
    ? getFilters(results?.aggregations, filterKey)
    : [];
  const selectedFilters = results?.data
    ? getSelectedFilters(filters, filterGroup)
    : [];

  const dictionary: IDictionary = {
    actions: {
      all: intl.get("screen.patientvariant.filter.selection.all"),
      none: intl.get("screen.patientvariant.filter.selection.none"),
      apply: intl.get("querybuilder.filters.actions.apply"),
      clear: intl.get("querybuilder.filters.actions.clear"),
      more: intl.get("querybuilder.filters.actions.more"),
      less: intl.get("querybuilder.filters.actions.less"),
    },
    operators: {
      between: intl.get("querybuilder.filters.operators.between"),
      lessThan: intl.get("querybuilder.filters.operators.lessthan"),
      lessThanOfEqual: intl.get(
        "querybuilder.filters.operators.lessthanorequal"
      ),
      greaterThan: intl.get("querybuilder.filters.operators.greaterthan"),
      greaterThanOrEqual: intl.get(
        "querybuilder.filters.operators.greaterthanorequal"
      ),
    },
    range: {
      is: intl.get("querybuilder.filters.range.is"),
      min: "min",
      max: "max",
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
        customContent={
          <CustomFilterSelector
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
