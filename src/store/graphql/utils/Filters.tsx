import intl from 'react-intl-universal';
import getFiltersDictionary from 'utils/translation';

import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import FilterSelector from '@ferlab/ui/core/components/filters/FilterSelector';
import { IFilter, IFilterGroup } from '@ferlab/ui/core/components/filters/types';
import { Aggregations } from 'store/graphql/models';
import { ExtendedMapping, ExtendedMappingResults } from 'store/graphql/models';
import { getFilterType } from '@ferlab/ui/core/data/filters/utils';
import { getSelectedFilters } from '@ferlab/ui/core/data/sqon/utils';
import {
  keyEnhance,
  keyEnhanceBooleanOnly,
  underscoreToDot,
} from '@ferlab/ui/core/data/arranger/formatting';
import { updateActiveQueryFilters } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';

export interface RangeAggs {
  stats: {
    max: number;
    min: number;
  };
}
export interface TermAggs {
  buckets: TermAgg[];
}

export interface TermAgg {
  doc_count: number;
  key: string;
}

const isTermAgg = (obj: TermAggs) => !!obj.buckets;
const isRangeAgg = (obj: RangeAggs) => !!obj.stats;

export const generateFilters = ({
  queryBuilderId,
  aggregations,
  extendedMapping,
  className = '',
  filtersOpen = true,
  filterFooter = false,
  showSearchInput = false,
  useFilterSelector = false,
}: {
  queryBuilderId: string;
  aggregations: Aggregations;
  extendedMapping: ExtendedMappingResults;
  className?: string;
  filtersOpen?: boolean;
  filterFooter?: boolean;
  showSearchInput?: boolean;
  useFilterSelector?: boolean;
}) =>
  Object.keys(aggregations || []).map((key) => {
    const found = (extendedMapping?.data || []).find(
      (f: ExtendedMapping) => f.field === underscoreToDot(key),
    );

    const filterGroup = getFilterGroup(found, aggregations[key], [], filterFooter);
    const filters = getFilters(aggregations, key);
    const selectedFilters = getSelectedFilters({
      queryBuilderId,
      filters,
      filterGroup,
    });
    const FilterComponent = useFilterSelector ? FilterSelector : FilterContainer;

    return (
      <div className={className} key={`${key}_${filtersOpen}`}>
        <FilterComponent
          dictionary={getFiltersDictionary()}
          maxShowing={5}
          isOpen={filtersOpen}
          filterGroup={filterGroup}
          filters={filters}
          onChange={(fg, f) =>
            updateActiveQueryFilters({
              queryBuilderId,
              filterGroup: fg,
              selectedFilters: f,
            })
          }
          searchInputVisible={showSearchInput}
          selectedFilters={selectedFilters}
        />
      </div>
    );
  });

const translateWhenNeeded = (group: string, key: string) =>
  ['state', 'panels'].includes(group)
    ? intl.get(`filters.options.${keyEnhance(key)}`)
    : `${keyEnhance(key)}`;

export const getFilters = (aggregations: Aggregations | null, key: string): IFilter[] => {
  if (!aggregations || !key) return [];
  if (isTermAgg(aggregations[key])) {
    return aggregations[key!].buckets
      .map((f: any) => {
        const translatedKey = translateWhenNeeded(key, f.key);
        const name = translatedKey ? translatedKey : f.key;
        const defaultValue = {
          data: {
            count: f.doc_count,
            key: keyEnhanceBooleanOnly(f.key),
          },
          id: f.key,
        };
        if (key.includes('lastNameFirstName') && f.key) {
          const nameSplit = f.key.split(',');
          const formatName = `${nameSplit[0].toUpperCase()} ${nameSplit[1]}`;
          return {
            ...defaultValue,
            name: formatName,
          };
        }
        return {
          ...defaultValue,
          name: name,
        };
      })
      .filter((f: any) => !(f.name === ''));
  } else if (aggregations[key]?.stats) {
    return [
      {
        data: { max: 1, min: 0 },
        id: key,
        name: translateWhenNeeded(key, key),
      },
    ];
  }
  return [];
};

export const getFilterGroup = (
  extendedMapping: ExtendedMapping | undefined,
  aggregation: any,
  rangeTypes: string[],
  filterFooter: boolean,
): IFilterGroup => {
  if (isRangeAgg(aggregation)) {
    return {
      field: extendedMapping?.field || '',
      title: intl
        .get(`filters.group.${extendedMapping?.field}`)
        .defaultMessage(extendedMapping?.displayName || ''),
      type: getFilterType(extendedMapping?.type || ''),
      config: {
        min: aggregation.stats.min,
        max: aggregation.stats.max,
        rangeTypes: rangeTypes.map((r) => ({
          name: r,
          key: r,
        })),
      },
    };
  }

  return {
    field: extendedMapping?.field || '',
    title: intl
      .get(`filters.group.${extendedMapping?.field}`)
      .defaultMessage(extendedMapping?.displayName || ''),
    type: getFilterType(extendedMapping?.type || ''),
    config: {
      nameMapping: [],
      withFooter: filterFooter,
    },
  };
};
