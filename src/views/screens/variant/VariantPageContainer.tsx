import React, { useState } from 'react';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import { IDictionary } from '@ferlab/ui/core/components/QueryBuilder/types';
import { isEmptySqon, resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import intl from 'react-intl-universal';
import { Tabs } from 'antd';
import { cloneDeep } from 'lodash';
import LineStyleIcon from 'components/icons/LineStyleIcon';
import { ExtendedMapping } from 'graphql/models';
import { MappingResults, useGetVariantPageData } from 'graphql/variants/actions';
import { IVariantResultTree, VariantEntity } from 'graphql/variants/models';

import { VARIANT_QB_ID } from './constants';
import VariantTableContainer from './VariantTableContainer';
import { useParams } from 'react-router';
import { dotToUnderscore } from '@ferlab/ui/core/data/arranger/formatting';
import GenericFilters from './filters/GenericFilters';
import { wrapSqonWithDonorId } from './utils';
import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { GET_VARIANT_COUNT } from 'graphql/variants/queries';
import { ArrangerApi } from 'api/arranger';
import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';

import styles from './VariantPageContainer.module.scss';

export type VariantPageContainerData = {
  mappingResults: MappingResults;
};

export type VariantPageResults = {
  data: {
    Variants: {
      hits: {
        edges: [
          {
            node: VariantEntity;
          },
        ];
        total?: number;
      };
    };
  };
  loading: boolean;
};

const DEFAULT_PAGE_NUM = 1;
export const DEFAULT_PAGE_SIZE = 20;

const VariantPageContainer = ({ mappingResults }: VariantPageContainerData) => {
  const [currentPageNum, setCurrentPageNum] = useState(DEFAULT_PAGE_NUM);
  const [currentPageSize, setcurrentPageSize] = useState(DEFAULT_PAGE_SIZE);
  const { patientid } = useParams<{ patientid: string }>();
  const { queryList, activeQuery } = useQueryBuilderState(VARIANT_QB_ID);

  const getVariantResolvedSqon = (query: ISyntheticSqon) =>
    wrapSqonWithDonorId(cloneDeep(resolveSyntheticSqon(queryList, query, 'donors')), patientid);

  const results = useGetVariantPageData({
    sqon: getVariantResolvedSqon(activeQuery),
    pageSize: currentPageSize,
    offset: currentPageSize * (currentPageNum - 1),
    sort: [
      { field: 'max_impact_score', order: 'desc' },
      { field: 'hgvsg', order: 'asc' },
    ],
  });
  const [selectedFilterContent, setSelectedFilterContent] = useState<
    React.ReactElement | undefined
  >(undefined);

  const dictionary: IDictionary = {
    query: {
      combine: {
        and: intl.get('querybuilder.query.combine.and'),
        or: intl.get('querybuilder.query.combine.or'),
      },
      noQuery: intl.get('querybuilder.query.noQuery'),
      facet: (key) => {
        if (key === 'locus') return 'Variant';
        const title = intl.get(`filters.group.${key}`);

        return title
          ? title
          : mappingResults?.extendedMapping?.find(
              (mapping: ExtendedMapping) => key === mapping.field,
            )?.displayName || key;
      },
      facetValueMapping: {
        panels: {
          MITN: intl.get('filters.options.panels.MITN'),
          DYSTM: intl.get('filters.options.panels.DYSTM'),
          MYOPC: intl.get('filters.options.panels.MYOPC'),
          DI: intl.get('filters.options.panels.DI'),
          RHAB: intl.get('filters.options.panels.RHAB'),
          MYASC: intl.get('filters.options.panels.MYASC'),
          MMG: intl.get('filters.options.panels.MMG'),
          HYPM: intl.get('filters.options.panels.HYPM'),
        },
        'consequences.predictions.fathmm_pred': {
          T: intl.get('filters.options.consequences.predictions.fathmm_pred.T'),
          D: intl.get('filters.options.consequences.predictions.fathmm_pred.D'),
        },
        'consequences.predictions.polyphen2_hvar_pred': {
          B: intl.get('filters.options.consequences.predictions.polyphen2_hvar_pred.B'),
          D: intl.get('filters.options.consequences.predictions.polyphen2_hvar_pred.D'),
          P: intl.get('filters.options.consequences.predictions.polyphen2_hvar_pred.P'),
        },
        'consequences.predictions.sift_pred': {
          T: intl.get('filters.options.consequences.predictions.sift_pred.T'),
          D: intl.get('filters.options.consequences.predictions.sift_pred.D'),
        },
        'consequences.predictions.lrt_pred': {
          N: intl.get('filters.options.consequences.predictions.lrt_pred.N'),
          U: intl.get('filters.options.consequences.predictions.lrt_pred.U'),
          D: intl.get('filters.options.consequences.predictions.lrt_pred.D'),
        },
        chromosome: {
          true: '1',
        },
      },
    },
    actions: {
      new: intl.get('querybuilder.actions.new'),
      addQuery: intl.get('querybuilder.actions.addQuery'),
      combine: intl.get('querybuilder.actions.combine'),
      labels: intl.get('querybuilder.actions.labels'),
      changeOperatorTo: intl.get('querybuilder.actions.changeOperatorTo'),
      delete: {
        title: intl.get('querybuilder.actions.delete.title'),
        cancel: intl.get('querybuilder.actions.delete.cancel'),
        confirm: intl.get('querybuilder.actions.delete.confirm'),
      },
      clear: {
        title: intl.get('querybuilder.actions.clear.title'),
        cancel: intl.get('querybuilder.actions.clear.cancel'),
        confirm: intl.get('querybuilder.actions.clear.confirm'),
        buttonTitle: intl.get('querybuilder.actions.clear.buttonTitle'),
        description: intl.get('querybuilder.actions.clear.description'),
      },
    },
  };

  return (
    <StackLayout vertical className={styles.variantPagecontainer}>
      <QueryBuilder
        className="patient-variant-repo__query-builder"
        headerConfig={{
          showHeader: true,
          showTools: false,
          defaultTitle: 'Requête de variants',
        }}
        IconTotal={<LineStyleIcon height="18" width="18" />}
        id={VARIANT_QB_ID}
        enableCombine={true}
        currentQuery={isEmptySqon(activeQuery) ? {} : activeQuery}
        dictionary={dictionary}
        facetFilterConfig={{
          enable: true,
          onFacetClick: (field) => {
            setSelectedFilterContent(
              <GenericFilters
                field={dotToUnderscore(field.content.field)}
                mappingResults={mappingResults}
              />,
            );
          },
          selectedFilterContent: selectedFilterContent,
          blacklistedFacets: ['genes.symbol', 'locus'],
        }}
        getResolvedQueryForCount={(sqon) => getVariantResolvedSqon(sqon)}
        fetchQueryCount={async (sqon) => {
          const { data } = await ArrangerApi.graphqlRequest<{ data: IVariantResultTree }>({
            query: GET_VARIANT_COUNT.loc?.source.body,
            variables: {
              sqon: getVariantResolvedSqon(sqon),
            },
          });

          return data?.data?.Variants.hits.total ?? 0;
        }}
      />
      <Tabs type="card" className={styles.variantTabs}>
        <Tabs.TabPane
          tab={intl.get('screen.patientvariant.results.table.variants') || 'Variants'}
          key="variants"
        >
          <VariantTableContainer
            results={results}
            filters={activeQuery}
            setCurrentPageCb={setCurrentPageNum}
            currentPageSize={currentPageSize}
            setcurrentPageSize={setcurrentPageSize}
            patientId={patientid}
          />
        </Tabs.TabPane>
        {/**
          <Tabs.TabPane
           disabled
           tab={intl.get('screen.patientvariant.results.table.genes') || 'Genes'}
           key="genes"
          >
           <GeneTableContainer
             results={results}
             filters={filters}
             setCurrentPageCb={setCurrentPageNum}
             currentPageSize={currentPageSize}
             setcurrentPageSize={setcurrentPageSize}
           />
          </Tabs.TabPane>
         */}
      </Tabs>
    </StackLayout>
  );
};
export default VariantPageContainer;
