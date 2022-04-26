import React, { useState } from 'react';
import { Button, Layout } from 'antd';
import { MappingResults } from 'graphql/variants/actions';
import CustomFilterContainer from './CustomFilterContainer';
import intl from 'react-intl-universal';
import { FilterGroup, FilterInfo } from './types';
import SuggesterWrapper from 'views/screens/variant/Suggester/Wrapper';
import Suggester from 'views/screens/variant/Suggester';

import styles from './Filters.module.scss';

type OwnProps = {
  queryBuilderId: string;
  mappingResults: MappingResults;
  filterInfo: FilterInfo;
};

const FilterList = ({ queryBuilderId, mappingResults, filterInfo }: OwnProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <>
      {filterInfo.suggester && (
        <SuggesterWrapper
          tooltipMessage={filterInfo.suggester.tooltipTitle()}
          title={filterInfo.suggester.title()}
        >
          <Suggester
            suggestionType={filterInfo.suggester.suggestionType}
            title={filterInfo.suggester.title()}
            placeholderText={filterInfo.suggester.placeholder()}
          />
        </SuggesterWrapper>
      )}
      <div className={styles.expandButtonContainerVariant}>
        <Button onClick={() => setFiltersOpen(!filtersOpen)} type="link">
          {filtersOpen
            ? intl.get('screen.patientvariant.filter.collapse.all')
            : intl.get('screen.patientvariant.filter.expand.all')}
        </Button>
      </div>
      <Layout className={styles.variantFilterWrapper}>
        {filterInfo.groups.map((group: FilterGroup, index) => (
          <div key={index}>
            {group.title ? (
              <div className={styles.filterGroupTitle}>{intl.get(group.title)}</div>
            ) : null}
            {group.fields.map((field) => (
              <CustomFilterContainer
                queryBuilderId={queryBuilderId}
                key={field}
                classname={styles.customFilterContainer}
                filterKey={field}
                mappingResults={mappingResults}
                filtersOpen={filtersOpen}
              />
            ))}
          </div>
        ))}
      </Layout>
    </>
  );
};

export default FilterList;
