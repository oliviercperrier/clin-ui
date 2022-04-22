import intl from 'react-intl-universal';
import { IDictionary as FiltersDict } from '@ferlab/ui/core/components/filters/types';
import { IProTableDictionary } from '@ferlab/ui/core/components/ProTable/types';

export const getFiltersDictionary = (): FiltersDict => ({
  actions: {
    all: intl.get('querybuilder.filters.actions.all'),
    apply: intl.get('querybuilder.filters.actions.apply'),
    clear: intl.get('querybuilder.filters.actions.clear'),
    less: intl.get('querybuilder.filters.actions.less'),
    more: intl.get('querybuilder.filters.actions.more'),
    none: intl.get('querybuilder.filters.actions.none'),
  },
  checkBox: {
    searchPlaceholder: intl.get('querybuilder.filters.checkbox.placeholder'),
  },
  messages: {
    errorNoData: intl.get('querybuilder.filters.messages.empty'),
  },
});

export const getProTableDictionary = (): IProTableDictionary => ({
  itemCount: {
    results: intl.get('protable.results'),
    noResults: intl.get('protable.noResults'),
    of: intl.get('protable.of'),
    selected: intl.get('protable.selected'),
    selectedPlural: intl.get('protable.selectedPlural'),
    selectAllResults: intl.get('protable.selectAllResults'),
    clear: intl.get('protable.clear'),
  },
});

export default getFiltersDictionary;
